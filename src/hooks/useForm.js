import { useState } from "react";

export function useForm(initialValues, validationRules = {}) {
  const [values, setValues]   = useState(initialValues);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name] && validationRules[name]) {
      const err = validationRules[name](value, values);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (validationRules[name]) {
      const err = validationRules[name](value, values);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  }

  function validate() {
    const newErrors = {};
    let valid = true;
    const allTouched = {};
    Object.keys(initialValues).forEach((k) => (allTouched[k] = true));
    setTouched(allTouched);
    Object.keys(validationRules).forEach((field) => {
      const err = validationRules[field](values[field], values);
      if (err) { newErrors[field] = err; valid = false; }
    });
    setErrors(newErrors);
    return valid;
  }

  function reset() {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }

  return { values, errors, touched, handleChange, handleBlur, validate, reset };
}

export const rules = {
  required: (label) => (value) =>
    !value || !value.trim() ? `${label} is required.` : "",

  email: () => (value) =>
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? "Please enter a valid email address." : "",

  minLength: (min, label) => (value) =>
    !value || value.length < min
      ? `${label} must be at least ${min} characters.` : "",

  matchField: (otherField, label) => (value, allValues) =>
    value !== allValues[otherField] ? `${label} does not match.` : "",

  phone: () => (value) =>
    !/^[6-9]\d{9}$/.test(value)
      ? "Enter a valid 10-digit Indian mobile number." : "",
};