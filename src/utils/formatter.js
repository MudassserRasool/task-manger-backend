/**
 * Converts a Unix timestamp to a PostgreSQL-compatible date-time format (YYYY-MM-DD HH:MM:SS).
 * @param {number} unixTimestamp - The Unix timestamp to convert.
 * @returns {string} - The formatted date-time string.
 */
function convertToPostgresDateTime(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export { convertToPostgresDateTime };
