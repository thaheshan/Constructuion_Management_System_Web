export type SriLankanDistrict =
  // Western Province
  | 'Colombo'
  | 'Gampaha'
  | 'Kalutara'
  // Central Province
  | 'Kandy'
  | 'Matale'
  | 'Nuwara Eliya'
  // Southern Province
  | 'Galle'
  | 'Matara'
  | 'Hambantota'
  // Northern Province
  | 'Jaffna'
  | 'Kilinochchi'
  | 'Mannar'
  | 'Vavuniya'
  | 'Mullaitivu'
  // Eastern Province
  | 'Batticaloa'
  | 'Ampara'
  | 'Trincomalee'
  // North Western Province
  | 'Kurunegala'
  | 'Puttalam'
  // North Central Province
  | 'Anuradhapura'
  | 'Polonnaruwa'
  // Uva Province
  | 'Badulla'
  | 'Monaragala'
  // Sabaragamuwa Province
  | 'Ratnapura'
  | 'Kegalle';

export interface ProvinceDistricts {
  province: string;
  districts: SriLankanDistrict[];
}

export const SRI_LANKAN_DISTRICTS: ProvinceDistricts[] = [
  {
    province: 'Western Province',
    districts: ['Colombo', 'Gampaha', 'Kalutara'],
  },
  {
    province: 'Central Province',
    districts: ['Kandy', 'Matale', 'Nuwara Eliya'],
  },
  {
    province: 'Southern Province',
    districts: ['Galle', 'Matara', 'Hambantota'],
  },
  {
    province: 'Northern Province',
    districts: ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu'],
  },
  {
    province: 'Eastern Province',
    districts: ['Batticaloa', 'Ampara', 'Trincomalee'],
  },
  {
    province: 'North Western Province',
    districts: ['Kurunegala', 'Puttalam'],
  },
  {
    province: 'North Central Province',
    districts: ['Anuradhapura', 'Polonnaruwa'],
  },
  {
    province: 'Uva Province',
    districts: ['Badulla', 'Monaragala'],
  },
  {
    province: 'Sabaragamuwa Province',
    districts: ['Ratnapura', 'Kegalle'],
  },
];

export const ALL_DISTRICTS: SriLankanDistrict[] = SRI_LANKAN_DISTRICTS.flatMap(
  (group) => group.districts
);

export function isValidSriLankanDistrict(district: string): district is SriLankanDistrict {
  return ALL_DISTRICTS.includes(district as SriLankanDistrict);
}
