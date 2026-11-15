export interface PartnerItem {
  id: string;
  name: string;
}

export const PARTNERS_HEADER = {
  title: 'Нам доверяют лидеры индустрии и национальные холдинги Казахстана',
};

export const PARTNERS_LIST: PartnerItem[] = [
  { id: 'astana-motors', name: 'ASTANA MOTORS' },
  { id: 'tenjotransit', name: 'TENJOTRANZIT' },
  { id: 'updl', name: 'UPDL CORP' },
  { id: 'nurbank', name: 'NURBANK' },
  { id: 'ktzh', name: 'КТЖ' },
  { id: 'samruk-kazyna', name: 'SAMRUK-KAZYNA' },
];
