export interface Config {
  alternative_logo?: AlternativeLogo;
  logo?: string;
  icon?: string;
  title?: string;
  banner?: string;
  bannerODS?: string;
  location_zoom?: number;
  location_lng?: number;
  location_lat?: number;
  map_top?: boolean;
  map_bottom?: boolean;
  logo_width?: string | number;
  logo_width_auth?: string | number;
  login_message?: string;
  has_hours?: boolean;
  activities_hours_table?: boolean;
  name?: string;
  translation?: boolean;
  idiom?: string;
  editTitle?: boolean;
  companyTypes?: CompanyType[];
  theme?: Theme;
  mao_hide?: boolean;
}

interface Theme {
  primary: string;
  secondary: string;
}

interface CompanyType {
  label: string;
  value: string;
}

interface AlternativeLogo {
  title: string;
  img1?: string;
  img2?: string;
}
