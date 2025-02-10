export class DateTimeHelper {
  static generateRandomDate(yearsBack = 1): Date {
    const now = new Date();
    const pastDate = new Date(
      now.getFullYear() - Math.floor(Math.random() * yearsBack),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    );
    return pastDate;
  }

  static toISOString(date: Date): string {
    return date.toISOString();
  }

  static formatDate(dateString: string, locale = 'en-US', options?: Intl.DateTimeFormatOptions): string {
    const date = new Date(dateString);
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString(locale, options || defaultOptions);
  }

  static compareDates(a: string, b: string): number {
    return new Date(b).getTime() - new Date(a).getTime();
  }
}
