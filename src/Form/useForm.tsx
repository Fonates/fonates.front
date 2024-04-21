import { useState } from "react";

export const useForm = (preloadData?: any) => {
      const [form, setForm]: any = useState(preloadData || {});

      const setFormValue = (name: string, value: string) => {
          setForm({
              ...form,
              [name]: value,
          });
      }

      return {
          form,
          setFormValue,
      }
}