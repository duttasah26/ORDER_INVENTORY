import { MapPin } from 'lucide-react';
import './StoreMap.css';

/**
 * Not a real embedded map — no mapping library is in the approved
 * dependency list. When coordinates are present, renders a small "View on
 * map" link out to Google Maps in a new tab. Otherwise (the Online store)
 * renders a short caption instead.
 *
 * @param {object} props
 * @param {number|null} [props.latitude]
 * @param {number|null} [props.longitude]
 */
export function StoreMap({ latitude, longitude }) {
  if (latitude == null || longitude == null) {
    return <p className="store-map__caption">Online store — no physical location.</p>;
  }

  const mapUrl = `https://www.google.com/maps?search_api=1&query=${latitude},${longitude}`;

  return (
    <a href={mapUrl} target="_blank" rel="noreferrer" className="store-map__link">
      <MapPin size={14} strokeWidth={2} aria-hidden="true" />
      View on map
    </a>
  );
}

export default StoreMap;
