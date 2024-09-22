export const jobTypeToText = (jType?: string) => {
  if (!jType) {
    return "";
  }

  switch (jType) {
    // case JobTypes.GUARD_SYSTEM:
    //   return "Gutter Guard System";
    // case JobTypes.INSTALLATION:
    //   return "Gutter Guard Installation";
    // case JobTypes.REPAIR:
    //   return "Gutter Repair";
    // case JobTypes.EPOXY_FLOORING:
    //   return "Epoxy Flooring";
    // case JobTypes.FRENCH_DRAINAGE:
    //   return "French Drainage";
    // case JobTypes.HVAC_PLUMBING_ELECTRICAL:
    //   return "HVAC, Plumbing, Electrical";
    // case JobTypes.PEST_CONTROL:
    //   return "Pest Control";
    // case JobTypes.ROOFING_SOLAR:
    //   return "Roofing, Solar";
    // case JobTypes.PAINTING_INDOOR_OUTDOOR:
    //   return "Painting, Indoor, Outdoor";
    // case JobTypes.WATER_SOFTWARE_SYSTEMS:
    //   return "Water, Software Systems";

    default:
      return jType;
  }
};
