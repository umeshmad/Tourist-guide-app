import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config';

/**
 * Read the logged-in user's email from AsyncStorage.
 * Returns null if no user is logged in.
 */
export async function getUserEmail() {
  try {
    return await AsyncStorage.getItem('userEmail');
  } catch {
    return null;
  }
}

/**
 * Fire-and-forget behaviour logger.
 * Call this whenever a user taps on an attraction, hotel, or restaurant.
 *
 * @param {string} email - user email
 * @param {object} item  - the place/hotel/restaurant object
 * @param {'attraction'|'hotel'|'restaurant'} itemType
 */
export function logBehaviour(email, item, itemType = 'attraction') {
  if (!email || !item) return;
  const itemId = String(item._id || item.id || '');
  const itemName = item.attraction_name || item.hotel_name || item.restaurant_name || item.name || '';
  const itemCategory = item.category || item.cuisine_type || item.features || '';
  const itemEnvironment = item.environment || item.city || '';
  const itemAttractionType = item.attraction_type || item.type || '';
  const itemCity = item.city || item.nearest_cities || '';
  const itemProvince = item.province || '';

  // Fire and forget — no await, no error blocking navigation
  fetch(`${BASE_URL}/log/behaviour`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      itemId,
      itemName,
      itemType,
      itemCategory,
      itemEnvironment,
      itemAttractionType,
      itemCity,
      itemProvince
    }),
  }).catch(() => {
    // Silently ignore — behaviour logging should never block the user
  });
}
