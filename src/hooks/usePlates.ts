import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

type Plate = {
  id: number;
  plate_number: string;
  last_update: string;
};

export const usePlates = () => {
  const [plates, setPlates] = useState<Plate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPlates = async () => {
    setIsLoading(true);

    try {
      const { data, error: fetchError } = await supabase
        .from("list_flyers")
        .select("*");

      if (fetchError) {
        throw fetchError;
      }

      setPlates(data as any);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlates();
  }, []);

  return { plates, isLoading, fetchPlates };
};
