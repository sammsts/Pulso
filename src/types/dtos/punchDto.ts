interface PunchDto {
  Id?: string | null;
  Latitude: number;
  Longitude: number;
  Address: string;
  Timestamp?: string | null;
  Type: 0 | 1;
  ManuallyEdited: boolean;
  UserId?: string | null;
  CreatedAt?: string | null;
  UpdatedAt?: string | null;
}

export type { PunchDto };