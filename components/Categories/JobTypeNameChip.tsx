import React from "react";

type AdminTypeChipProps = {
  type: JobType | string;
};

const pastelColors = {
  "Fascia Replacement": "bg-[#0052CC]/20",
  "Fascia Repair": "bg-[#36B37E]/20",
  "Soffit Replacement": "bg-[#6E76FF]/20",
  "Soffit Repair": "bg-[#FFAB00]/20",
  "Roof Rejuvenation": "bg-[#FF5630]/20",
  "Paver Install": "bg-[#42526E]/20",
  "Paver Stripping": "bg-[#0052CC]/20",
  "Paver Sealing": "bg-[#36B37E]/20",
  "Gutter Cleaning": "bg-[#6E76FF]/20",
  "Window Cleaning": "bg-[#FFAB00]/20",
  default: "bg-[#FFAB00]/20",
};

enum JobType {
  FasciaReplacement = "Fascia Replacement",
  FasciaRepair = "Fascia Repair",
  SoffitReplacement = "Soffit Replacement",
  SoffitRepair = "Soffit Repair",
  RoofRejuvenation = "Roof Rejuvenation",
  PaverInstall = "Paver Install",
  PaverStripping = "Paver Stripping",
  PaverSealing = "Paver Sealing",
  GutterCleaning = "Gutter Cleaning",
  WindowCleaning = "Window Cleaning",
  default = "default",
}

const JobTypeNameChip: React.FC<AdminTypeChipProps> = ({ type }) => {
  const getTypeColor = (
    jobType: JobType | string
  ): keyof typeof pastelColors => {
    switch (jobType) {
      case JobType.FasciaReplacement:
        return "Fascia Replacement";
      case JobType.FasciaRepair:
        return "Fascia Repair";
      case JobType.SoffitReplacement:
        return "Soffit Replacement";
      case JobType.SoffitRepair:
        return "Soffit Repair";
      case JobType.RoofRejuvenation:
        return "Roof Rejuvenation";
      case JobType.PaverInstall:
        return "Paver Install";
      case JobType.PaverStripping:
        return "Paver Stripping";
      case JobType.PaverSealing:
        return "Paver Sealing";
      case JobType.GutterCleaning:
        return "Gutter Cleaning";
      case JobType.WindowCleaning:
        return "Window Cleaning";
      default:
        return "default";
    }
  };

  return (
    <div className="flex gap-2">
      <div
        className={`font-sans relative grid select-none items-center whitespace-nowrap rounded-md ${
          pastelColors[getTypeColor(type)]
        } px-2 py-1 text-xs font-bold uppercase text-green-900`}
      >
        <span className="dark:text-white/70">{type}</span>
      </div>
    </div>
  );
};

export default JobTypeNameChip;
