export function getDeviceInfo(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  const browser = /Edg\/(\d+)/.test(ua) ? 'Edge'
    : /Chrome\/(\d+)/.test(ua) ? 'Chrome'
    : /Firefox\/(\d+)/.test(ua) ? 'Firefox'
    : /Safari\/(\d+)/.test(ua) ? 'Safari'
    : 'Unknown';
  const os = /Windows/.test(ua) ? 'Windows'
    : /Mac OS X/.test(ua) ? 'macOS'
    : /Android/.test(ua) ? 'Android'
    : /iPhone|iPad/.test(ua) ? 'iOS'
    : /Linux/.test(ua) ? 'Linux'
    : 'Unknown';
  const mobile = /Mobile|Android|iPhone|iPad/.test(ua) ? 'Mobile' : 'Desktop';
  return `${os} · ${browser} · ${mobile}`;
}

export function getDeviceFingerprint(): string {
  if (typeof window === 'undefined') return 'unknown';
  const components = [
    navigator.userAgent,
    navigator.language,
    navigator.platform,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset().toString(),
  ];
  const str = components.join('|');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
