export const debounce = (func, time) => {
  let timeout;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      console.log("ARGS: ", args);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, time);
  };
};
