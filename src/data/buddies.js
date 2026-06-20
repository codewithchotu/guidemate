import travelData from "./travelData";

// Extract all buddies from all cities and export them
const buddies = Object.values(travelData).reduce((all, cityInfo) => {
  return [...all, ...cityInfo.buddies];
}, []);

export default buddies;