import { useState } from "react";

export const useForm = (preloadData?: any) => {
      const [form, setForm]: any = useState(preloadData || {});

      const setFormValue = (name: string, value: any) => {
          setForm((values: any) => ({
              ...values,
              [name]: value,
          }));
      }

      return {
          form,
          setFormValue,
      }
}