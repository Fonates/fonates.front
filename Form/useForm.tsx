import { useState } from "react";

export const useForm = () => {
      const [form, setForm] = useState({});

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