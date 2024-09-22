import { jobTypeToText } from "./job-type-to-text";

export const jobTypeToStyle = (jType: string) => {
  // switch (jType) {
  //   case jobTypeToText(JobTypes.GUARD_SYSTEM).toString():
  //     return {
  //       border: "border-amber-500",
  //       background: "bg-amber-200",
  //     };
  //   case jobTypeToText(JobTypes.INSTALLATION).toString():
  //     return {
  //       border: "border-lime-500",
  //       background: "bg-lime-200",
  //     };
  //   case jobTypeToText(JobTypes.REPAIR).toString():
  //     return {
  //       border: "border-emerald-500",
  //       background: "bg-emerald-200",
  //     };
  //   case jobTypeToText(JobTypes.EPOXY_FLOORING).toString():
  //     return {
  //       border: "border-primary",
  //       background: "bg-purple-100",
  //     };
  //   case jobTypeToText(JobTypes.FRENCH_DRAINAGE).toString():
  //     return {
  //       border: "border-primary",
  //       background: "bg-pink-100",
  //     };
  //   case jobTypeToText(JobTypes.HVAC_PLUMBING_ELECTRICAL).toString():
  //     return {
  //       border: "border-primary",
  //       background: "bg-yellow-100",
  //     };
  //   case jobTypeToText(JobTypes.PEST_CONTROL).toString():
  //     return {
  //       border: "border-primary",
  //       background: "bg-cyan-100",
  //     };
  //   case jobTypeToText(JobTypes.ROOFING_SOLAR).toString():
  //     return {
  //       border: "border-primary",
  //       background: "bg-teal-100",
  //     };
  //   case jobTypeToText(JobTypes.PAINTING_INDOOR_OUTDOOR).toString():
  //     return {
  //       border: "border-primary",
  //       background: "bg-rose-100",
  //     };
  //   case jobTypeToText(JobTypes.WATER_SOFTWARE_SYSTEMS).toString():
  //     return {
  //       border: "border-primary",
  //       background: "bg-indigo-100",
  //     };
  // default:
  return {
    border: "border-primary",
    background: "bg-gray-200",
  };
  // }
};
