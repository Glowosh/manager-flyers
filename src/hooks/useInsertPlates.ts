import { useCallback, useState } from "react";
import { supabase } from "../lib/supabase";

const dateDiffInDays = (date1: Date, date2: Date) => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

function getCurrentTimestampWithTimezone() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const timezoneOffset = -now.getTimezoneOffset();
  const sign = timezoneOffset >= 0 ? "+" : "-";
  const offsetHours = String(
    Math.floor(Math.abs(timezoneOffset) / 60)
  ).padStart(2, "0");
  const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, "0");

  const formattedTimestamp = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMinutes}`;
  return formattedTimestamp;
}

export const useInsertPlates = () => {
  const [isLoadingPlate, setIsLoadingPlate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const insertPlate = useCallback(async (plateNumber: string) => {
    setIsLoadingPlate(true);
    setError(null);
    const newPlateNumber = plateNumber
      .toUpperCase()
      .replace(/-/g, "")
      .replace(/\./g, "")
      .replace(/\s+/g, "")
      .trim();

    try {
      const { data: existingPlates, error: fetchError } = await supabase
        .from("list_flyers")
        .select("*")
        .eq("plate_number", newPlateNumber);

      if (fetchError) {
        throw fetchError;
      }
      const lastPlate = existingPlates?.[0];

      if (existingPlates.length > 0) {
        const lastUpdateDate = new Date(lastPlate.last_update);
        const currentDate = new Date();

        const daysDifference = dateDiffInDays(lastUpdateDate, currentDate);

        if (daysDifference < 20) {
          return {
            success: false,
            text: "Plate number cannot be added. It's been less than 20 days since the last update.",
          };
        }
      }

      const { error: insertError } = lastPlate
        ? await supabase
            .from("list_flyers")
            .update([
              {
                plate_number: newPlateNumber,
                last_update: getCurrentTimestampWithTimezone(),
              },
            ])
            .match({
              id: lastPlate?.id,
            })
        : await supabase.from("list_flyers").insert([
            {
              plate_number: newPlateNumber,
              lastPlate: getCurrentTimestampWithTimezone(),
            },
          ]);

      if (insertError) {
        throw insertError;
      }

      return {
        success: true,
        text: "Plate number added successfully.",
      };
    } catch (error) {
      setError((error as Error).message);
      alert(`Error inserting plate: ${(error as Error).message}`);
    } finally {
      setIsLoadingPlate(false);
    }
  }, []);

  return { insertPlate, isLoadingPlate, error };
};
