import { useCallback, useState } from "react";
import { supabase } from "../lib/supabase";

const dateDiffInDays = (date1: Date, date2: Date) => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const useInsertPlates = () => {
  const [isLoadingPlate, setIsLoadingPlate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const insertPlate = useCallback(async (plateNumber: string) => {
    setIsLoadingPlate(true);
    setError(null);

    try {
      const { data: existingPlates, error: fetchError } = await supabase
        .from("list_flyers")
        .select("*")
        .eq("plate_number", plateNumber);

      if (fetchError) {
        throw fetchError;
      }

      if (existingPlates.length > 0) {
        const lastPlate = existingPlates[0];
        const lastUpdateDate = new Date(lastPlate.last_update);
        const currentDate = new Date();

        const daysDifference = dateDiffInDays(lastUpdateDate, currentDate);

        if (daysDifference < 7) {
          alert(
            "Plate number cannot be added. It's been less than 7 days since the last update."
          );
          return null;
        }
      }

      const { data, error: insertError } = await supabase
        .from("list_flyers")
        .insert([{ plate_number: plateNumber }]);

      if (insertError) {
        throw insertError;
      }

      return data;
    } catch (error) {
      setError((error as Error).message);
      alert(`Error inserting plate: ${(error as Error).message}`);
    } finally {
      setIsLoadingPlate(false);
    }
  }, []);

  return { insertPlate, isLoadingPlate, error };
};
