import { Pedometer } from "expo-sensors";
import "react-native-url-polyfill/auto";
import { supabase } from "../supabase/supabase";

export const StepsChallengeService = {
  // Méthode de récupération du total de pas via fonction SQL get_steps_challenge_total_count.
  getAllSteps: async function (challengeId) {
    const { data, error } = await supabase.rpc(
      "get_steps_challenge_total_count",
      { id_param: challengeId }
    );

    if (error) {
      console.error("Erreur lors de la récupération des données :", error);
      return null;
    }

    return data;
  },
  // Méthode de récupération du total de pas par jours via fonction SQL get_steps_challenge_day_count.
  getDaySteps: async function (challengeId) {
    const { data, error } = await supabase.rpc(
      "get_steps_challenge_day_count",
      { id_param: challengeId }
    );

    if (error) {
      console.error("Erreur lors de la récupération des données :", error);
      return null;
    }

    const returnObject = {
      count: data === null ? 0 : data,
      date: new Date().toJSON().substring(0, 10),
    };

    return returnObject;
  },
  // Méthode de récupération du total de pas par semaines via fonction SQL get_steps_challenge_week_count.
  getWeekSteps: async function (challengeId) {
    // Afficher du lundi du début de semaine au jour actuel de la semaine.
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(
      today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
    );

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const { data, error } = await supabase.rpc(
      "get_steps_challenge_week_count",
      {
        id_param: challengeId,
        start_of_week: startOfWeek,
        end_of_week: endOfWeek,
      }
    );

    if (error) {
      console.error("Erreur lors de la récupération des données :", error);
      return null;
    }

    const returnObject = {
      count: data,
      date: new Date().toJSON().substring(0, 10),
    };

    return returnObject;
  },
  // Méthode de récupération du total de pas par mois via fonction SQL get_steps_challenge_month_count.
  getMonthSteps: async function (challengeId) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(endOfMonth.getDate() - 1);
    endOfMonth.setHours(23, 59, 59, 999);

    const { data, error } = await supabase.rpc(
      "get_steps_challenge_month_count",
      {
        id_param: challengeId,
        start_of_month: startOfMonth,
        end_of_month: endOfMonth,
      }
    );

    if (error) {
      console.error("Erreur lors de la récupération des données :", error);
      return null;
    }

    const returnObject = { count: data, month: startOfMonth.getMonth() };

    return returnObject;
  },
  getMonthStepsStoredData: async function (challengeId) {
    const numberOfMonthToGoBack = 4;

    let today = new Date().toJSON().substring(0, 10);

    // On construit la date qui correspond à 5 mois en arrière (en commencant le premier jours du mois).
    let fiveMonthAgo = new Date();
    fiveMonthAgo.setMonth(fiveMonthAgo.getMonth() - numberOfMonthToGoBack);
    fiveMonthAgo.setDate(1);
    fiveMonthAgo = fiveMonthAgo.toJSON().substring(0, 10);

    const monthlyStepsArray = [];

    try {
      // construit un tableau avec les numéros des 4 mois à récupérer.
      const arrayOfMonth = await this.buildArrayOfMonth(fiveMonthAgo, today);

      // récupére les données des 4 mois en base.
      let { data, error } = await supabase
        .from("monthly_challenge_steps")
        .select("date, count")
        .eq("challenge_id", challengeId)
        .lte("date", today)
        .gte("date", fiveMonthAgo);

      // Pour chaque mois des 4 mois
      for (month of arrayOfMonth) {
        // On filtre les données appartenant au mois en cours (month) qu'on met dans un nouveau tableau (dans l'ordre d'affichage du graphiqe);
        data.forEach((result) => {
          const resultDate = new Date(result.date);

          if (resultDate.getMonth() === month) {
            monthlyStepsArray.push({ count: result.count, month: month });
          }
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      return null;
    }

    return monthlyStepsArray;
  },
  buildArrayOfMonth: async function (fiveMonthAgo, now) {
    try {
      const arrayOfMonth = [];

      // Fonction pour obtenir les mois entre deux dates
      const currentDate = new Date(fiveMonthAgo);
      const oldDate = new Date(now);

      nowMinusOneMonth = oldDate.setMonth(oldDate.getMonth() - 1);

      while (currentDate <= nowMinusOneMonth) {
        arrayOfMonth.push(parseInt(currentDate.getMonth()));

        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      return arrayOfMonth;
    } catch (error) {
      console.log("erreur dans les dates");
      return null;
    }
  },
  getWeeksStepsStoredData: async function (challengeId) {
    const numberOfDaysToGoBack = 27;

    const now = new Date();

    // On construit la date du dimanche précédent la semaine actuelle.
    let dayOfWeek = new Date().getDay();
    // On soustrait le nombre de jours nécessaire pour atteindre le dimanche précédent
    let diff = dayOfWeek === 0 ? 7 : dayOfWeek; // Si c'est dimanche, on soustrait 7 jours pour obtenir le dimanche précédent
    let dateOfLastSunday = new Date(now.setDate(now.getDate() - diff));

    let dateOfFirstDay = new Date(
      new Date(dateOfLastSunday).setDate(dateOfLastSunday.getDate() - 27)
    );

    dateOfLastSunday = dateOfLastSunday.toJSON().substring(0, 10);
    dateOfFirstDay = dateOfFirstDay.toJSON().substring(0, 10);

    try {
      // récupére les données des 4 semaines en base.
      let { data, error } = await supabase
        .from("weekly_challenge_steps")
        .select("date, count")
        .eq("challenge_id", challengeId)
        .gte("date", dateOfFirstDay)
        .lte("date", dateOfLastSunday)
        .order("date", { ascending: true });

      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      return null;
    }
  },
  getDaysStepsStoredData: async function (challengeId) {
    const numberOfDaysToGoBack = 5;

    let today = new Date();
    let yesterday = new Date(new Date(today).setDate(today.getDate() - 1));
    let fiveDaysAgo = new Date(new Date(today).setDate(today.getDate() - 4));

    yesterday = yesterday.toJSON().substring(0, 10);
    fiveDaysAgo = fiveDaysAgo.toJSON().substring(0, 10);

    try {
      // récupére les données des 4 jours en base.
      let { data, error } = await supabase
        .from("daily_challenge_steps")
        .select("date, count")
        .eq("challenge_id", challengeId)
        .gte("date", fiveDaysAgo)
        .lte("date", yesterday)
        .order("date", { ascending: true });

      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      return null;
    }
  },
  getStepsData: async function (challengeId) {
    const arrayOfSteps = [];

    const stepsDataForActualWeeks = await this.getWeekSteps(challengeId);

    const stepsDataForActualDay = await this.getDaySteps(challengeId);

    const stepsDataForActualMonth = await this.getMonthSteps(challengeId);

    const stepsDataForOtherMonths = await this.getMonthStepsStoredData(
      challengeId
    );

    const stepsDataForOtherWeeks = await this.getWeeksStepsStoredData(
      challengeId
    );

    const stepsDataForOtherDays = await this.getDaysStepsStoredData(
      challengeId
    );

    stepsDataForOtherMonths.push(stepsDataForActualMonth);
    stepsDataForOtherWeeks.push(stepsDataForActualWeeks);
    stepsDataForOtherDays.push(stepsDataForActualDay);

    arrayOfSteps.push(
      stepsDataForOtherMonths,
      stepsDataForOtherWeeks,
      stepsDataForOtherDays
    );

    return arrayOfSteps;
  },
};
