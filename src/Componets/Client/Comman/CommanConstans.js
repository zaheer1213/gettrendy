// const BASEURL = "http://64.227.159.26:8001";
const BASEURL = "https://gettrendy.in:8000";

// Countries List
const Countries = [
  { value: "CA", label: "Canada", flag: "CA", dialCode: "+1" },
  { value: "US", label: "United States", flag: "US", dialCode: "+1" },
  { value: "AF", label: "Afghanistan", flag: "AF", dialCode: "+93" },
  { value: "AX", label: "Åland Islands", flag: "AX", dialCode: "+358" },
  { value: "AL", label: "Albania", flag: "AL", dialCode: "+355" },
  { value: "DZ", label: "Algeria", flag: "DZ", dialCode: "+213" },
  { value: "AS", label: "American Samoa", flag: "AS", dialCode: "+1-684" },
  { value: "AD", label: "Andorra", flag: "AD", dialCode: "+376" },
  { value: "AO", label: "Angola", flag: "AO", dialCode: "+244" },
  { value: "AI", label: "Anguilla", flag: "AI", dialCode: "+1-264" },
  { value: "AQ", label: "Antarctica", flag: "AQ", dialCode: "+672" },
  { value: "AG", label: "Antigua and Barbuda", flag: "AG", dialCode: "+1-268" },
  { value: "IN", label: "India", flag: "IN", dialCode: "+91" },
  { value: "GB", label: "United Kingdom", flag: "GB", dialCode: "+44" },
];

const UserRoles = {
  SERVICE_PROVIDER: "Service",
  NORMAL: "Normal",
  ADMIN: "Admin",
  Customer: "Customer",
  STORE_ADMIN: "Store_admin",
  DELIVERY_MAN: "Delivery_man",
};
export { BASEURL, Countries, UserRoles };
