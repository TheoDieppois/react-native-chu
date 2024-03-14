import { Pedometer } from "expo-sensors";
import "react-native-url-polyfill/auto";
import { supabase } from "../supabase/supabase";

export const StepsService = {
  // méthode qui récupère les pas de l'utilisateur pour les 5 derniers mois et créer un tableau qui contient les pas des derniers mois semaines et jours.
  getSteps: async function (pkId) {
    const arrayOfData = [];

    const numberOfMonthToGoBack = 4;
    const numberOfWeeksToGoBack = 4;
    const numberOfDays = 4;

    // La date d'ajourd'hui.
    const now = new Date();
    const todayDate = now.toJSON().substring(0, 10); // on enleve les heures min secondes de la date et on cast en JSON.

    // On construit la date qui correspond à 5 mois en arrière (en commencant le premier jours du mois).
    const monthDate = new Date();
    monthDate.setMonth(monthDate.getMonth() - numberOfMonthToGoBack);
    monthDate.setDate(1);
    const fiveMonthAgo = monthDate.toJSON().substring(0, 10); // on enleve les heures min secondes de la date et on cast en JSON.

    // On construit la date qui correspond au lundi du début de la semaine 5 semaines en arrière.
    var dayOfWeek = now.getDay(); // Récupérer le jour de la semaine (0 pour dimanche, 1 pour lundi, ..., 6 pour samedi)
    var diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Calculer la différence de jours entre le jour actuel et le lundi (0 si c'est un lundi)
    var daysToSubtract = numberOfWeeksToGoBack * 7 + diff; // Calculer le nombre de jours à soustraire pour obtenir le lundi il y a 5 semaines
    var mondayFiveWeeksBefore = new Date(
      now.getTime() - daysToSubtract * 24 * 60 * 60 * 1000
    )
      .toJSON()
      .substring(0, 10); // Soustraire les jours en millisecondes

    // On construit la date qui correspond à 5 jours avant la date d'aujourd'hui.
    const daysDate = new Date();
    daysDate.setDate(now.getDate() - numberOfDays);
    const fiveDaysAgo = daysDate.toJSON().substring(0, 10);

    // On récupére toutes les valeur des pas entre les deux dates.
    let { data: fiveMonthStepsData, error } = await supabase
      .from("daily_user_steps")
      .select("date, count")
      .eq("user_id", pkId)
      .lte("date", todayDate)
      .gte("date", fiveMonthAgo);

    const arrayOfMonth = await this.createArrayForMonthData(
      fiveMonthStepsData,
      fiveMonthAgo,
      todayDate
    );

    const arrayOfWeeks = await this.createArrayForWeeksData(
      fiveMonthStepsData,
      mondayFiveWeeksBefore,
      todayDate
    );

    const arrayOfDays = await this.createArrayForDaysData(
      fiveMonthStepsData,
      fiveDaysAgo,
      todayDate
    );

    arrayOfData.push(arrayOfMonth, arrayOfWeeks, arrayOfDays);

    return arrayOfData;
  },
  // méthode qui créer le tableau de pas pour les 5 derniers mois.
  createArrayForMonthData: async function (
    fiveMonthStepsData,
    oldDate,
    nowDate
  ) {
    const fiveMonthAgo = new Date(oldDate);
    const oldMonth = fiveMonthAgo.getMonth();

    const now = new Date(nowDate);
    const newMonth = now.getMonth();
    let number = 0;
    const monthlyStepsArray = [];

    const arrayOfMonth = await this.buildArrayOfMonth(fiveMonthAgo, now);

    // Pour chaque mois des 5 derniers mois
    for (month of arrayOfMonth) {
      // On filtre les données appartenant au mois en cours (month) qu'on met dans un nouveau tableau.
      const actualMonth = fiveMonthStepsData.filter((result) => {
        const resultDate = new Date(result.date);

        return resultDate.getMonth() === month;
      });

      // On additionne le pas pour tous le mois et on met la valeur dans number.
      actualMonth.forEach((element) => (number += element.count));
      // On push la valeur dans un nouvel array.
      monthlyStepsArray.push({ month: month, count: number });

      number = 0;
    }

    return monthlyStepsArray;
  },
  buildArrayOfMonth: async function (fiveMonthAgo, now) {
    const arrayOfMonth = [];

    // Fonction pour obtenir les mois entre deux dates
    var currentDate = new Date(fiveMonthAgo);

    while (currentDate <= now) {
      arrayOfMonth.push(parseInt(currentDate.getMonth()));

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return arrayOfMonth;
  },
  // méthode qui récupère les pas de l'utilisateur pour les 5 dernieres semaine.
  createArrayForWeeksData: async function (
    fiveMonthStepsData,
    oldDate,
    nowDate
  ) {
    const mondayFiveWeeksBefore = new Date(oldDate);
    const today = new Date(nowDate);
    const arrayOfWeeks = [];
    let stepsNumber = 0;

    // On construit le tableau de données des 5 dernieres semaine de l'utilisateur.
    // Il doit contenir au max 35 résultats (en fonction du jour de la semaine). (entre 28 et 35 si le user à des pas tous les jours.)
    const fiveWeeksArray = fiveMonthStepsData.filter((result) => {
      const resultDate = new Date(result.date);

      const isTrue =
        resultDate >= mondayFiveWeeksBefore && resultDate <= today
          ? true
          : false;

      return isTrue;
    });

    // On tri le tableau
    fiveWeeksArray.sort((a, b) => new Date(a.date) - new Date(b.date));

    // On construit un tableau qui contient toutes les dates entre les deux dates (mondayFiveWeeksBefore et today);
    const arrayOfDates = await this.buildArrayOfDates(
      mondayFiveWeeksBefore,
      today
    );

    // On itère sur chaque object du tableau arrayOfDates ex => {"monday": 2024-01-29T00:00:00.000Z, "sunday": 2024-02-04T00:00:00.000Z}
    arrayOfDates.forEach((dateObject) => {
      // Marchouille ! régler le problème du dernier lundi ...

      this.monday = dateObject.monday;
      this.sunday = dateObject.sunday;

      // On itère sur les datas et on à additionne les pas de chaque semaine (dates contenue entre le lundi et le dimanche).
      fiveWeeksArray.forEach((jour) => {
        const date = new Date(jour.date);

        if (date >= this.monday && date <= this.sunday) {
          stepsNumber += jour.count;
        }
        // Si c'est la derniere semaine des 5 (pas de dimanche dans l'objet dateObject).
        else if (!dateObject.hasOwnProperty("sunday")) {
          if (date >= this.monday) {
            stepsNumber += jour.count;
          }
        }
        const monday = dateObject.monday.toString();
      });

      // on push un object avec la date du lundi de la semaine en cours d'itération avec le nombre de pas.
      arrayOfWeeks.push({ count: stepsNumber });

      // On reset le count pour la prochaine semaine.
      stepsNumber = 0;
    });

    return arrayOfWeeks;
  },
  // Méthode qui itere sur chaque date compris entre deux dates et construit un objet contenant la date de chaque lundi et dimanche [{datelundi, datedimanche}, {datelundi, datedimanche}];
  buildArrayOfDates: async (mondayFiveWeeksBefore, today) => {
    const object = {};
    let arrayOfDate = [];
    let flag = 0;
    let currentDate = mondayFiveWeeksBefore;
    let iterator = 0;

    // Boucle qui itère sur toutes les dates entre deux dates.
    while (mondayFiveWeeksBefore <= today) {
      // si Lundi ou dimanche
      const isMonday = currentDate.getDay() === 1 ? true : false;
      const isSunday = currentDate.getDay() === 0 ? true : false;

      //Si on à déja passé une fois un lundi et un dimanche on vide l'objet pour construire un objet vierge.
      if (flag >= 2) {
        arrayOfDate.push({ ...object });

        for (const key in object) {
          delete object[key];
        }
        flag = 0;
      }
      // Si c'est un lundi ou dimancge on créer une entrée dans un objet
      if ((isMonday || isSunday) && flag < 2) {
        isMonday
          ? (object["monday"] = new Date(currentDate))
          : (object["sunday"] = new Date(currentDate));

        flag++;

        // Si c'est le dernier lundi des dates qu'on parcours on met un objet simple.
        if (iterator === 28) {
          arrayOfDate.push({ ...object });
        }
      }

      // Vérifie si la date courante est supérieure à la date du jour pour sortir du while.
      if (currentDate > today) {
        break;
      }

      currentDate.setDate(currentDate.getDate() + 1); // Passer au jour suivant

      iterator++;
    }

    return arrayOfDate;
  },
  // méthode qui créer le tableau de pas pour les 5 derniers jours.
  createArrayForDaysData: async function (
    fiveMonthStepsData,
    oldDate,
    nowDate
  ) {
    const fiveDaysAgo = new Date(oldDate);
    const today = new Date(nowDate);
    let currentDate = new Date(fiveDaysAgo);
    const dailyStepsArray = [];

    // On boucle sur chaque jours entre les deux dates.
    while (currentDate <= today) {
      // On vérifie dans le tableau fiveMonthStepsData si on à de la donnée pour ce jour.
      const stepsArray = fiveMonthStepsData.filter((day) => {
        const date = new Date(day.date);

        return date.getTime() === currentDate.getTime();
      });

      // Si le filter nous à retourné un tableau vide on push un objet vide dans le tableau final.
      if (stepsArray.length === 0) {
        dailyStepsArray.push({
          count: 0,
          date: currentDate.toJSON().substring(0, 10),
        });
      } else {
        // Sinon on push la valeur dans stepsArray
        dailyStepsArray.push(stepsArray[0]);
      }

      currentDate.setDate(currentDate.getDate() + 1); // On passe au jour suivant.
    }

    return dailyStepsArray;
  },
};
