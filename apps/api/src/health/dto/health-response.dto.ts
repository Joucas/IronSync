export class HealthResponseDto {
  /** Overall API status. */
  status: 'ok';

  /** Database connectivity. */
  database: 'up';

  /** Server time when the check ran (ISO 8601). */
  timestamp: string;
}
