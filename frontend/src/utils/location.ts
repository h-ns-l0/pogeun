export async function reverseGeocodeKoreanLocation(
  latitude: number,
  longitude: number
): Promise<string | null> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("accept-language", "ko");

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`reverse geocoding failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    address?: {
      city?: string;
      borough?: string;
      county?: string;
      state?: string;
      suburb?: string;
      town?: string;
      village?: string;
    };
  };

  const address = data.address;
  if (!address) {
    return null;
  }

  const candidates = [
    address.city,
    address.town,
    address.county,
    address.borough,
    address.suburb,
    address.village,
    address.state,
  ].filter(Boolean);

  return candidates[0] ?? null;
}
