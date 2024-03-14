import { supabase } from "../supabase/supabase";
export const NotificationService = {
  getPassedNotifications: async function () {
    try {
      let { data: notificationInfos, notificationError } = await supabase
        .from("notification")
        .select("*")
        .eq("sent", true);

      return notificationInfos;
    } catch (notificationError) {
      console.log("An error occured " + notificationError);
    }
  },
};
