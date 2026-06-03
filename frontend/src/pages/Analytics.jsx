import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUrlStore } from '../store/urlStore';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { Copy, ArrowLeft } from 'lucide-react';

const COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb7185'];

const COUNTRY_NAMES = {
  AD: 'Andorra', AE: 'United Arab Emirates', AF: 'Afghanistan', AG: 'Antigua and Barbuda', AI: 'Anguilla',
  AL: 'Albania', AM: 'Armenia', AO: 'Angola', AQ: 'Antarctica', AR: 'Argentina', AS: 'American Samoa',
  AT: 'Austria', AU: 'Australia', AW: 'Aruba', AX: 'Åland Islands', AZ: 'Azerbaijan', BA: 'Bosnia and Herzegovina',
  BB: 'Barbados', BD: 'Bangladesh', BE: 'Belgium', BF: 'Burkina Faso', BG: 'Bulgaria', BH: 'Bahrain',
  BI: 'Burundi', BJ: 'Benin', BL: 'Saint Barthélemy', BM: 'Bermuda', BN: 'Brunei', BO: 'Bolivia',
  BQ: 'Caribbean Netherlands', BR: 'Brazil', BS: 'Bahamas', BT: 'Bhutan', BV: 'Bouvet Island', BW: 'Botswana',
  BY: 'Belarus', BZ: 'Belize', CA: 'Canada', CC: 'Cocos (Keeling) Islands', CD: 'DR Congo', CF: 'Central African Republic',
  CG: 'Congo', CH: 'Switzerland', CI: 'Ivory Coast', CK: 'Cook Islands', CL: 'Chile', CM: 'Cameroon',
  CN: 'China', CO: 'Colombia', CR: 'Costa Rica', CU: 'Cuba', CV: 'Cape Verde', CW: 'Curaçao',
  CX: 'Christmas Island', CY: 'Cyprus', CZ: 'Czechia', DE: 'Germany', DJ: 'Djibouti', DK: 'Denmark',
  DM: 'Dominica', DO: 'Dominican Republic', DZ: 'Algeria', EC: 'Ecuador', EE: 'Estonia', EG: 'Egypt',
  EH: 'Western Sahara', ER: 'Eritrea', ES: 'Spain', ET: 'Ethiopia', FI: 'Finland', FJ: 'Fiji',
  FK: 'Falkland Islands', FM: 'Micronesia', FO: 'Faroe Islands', FR: 'France', GA: 'Gabon', GB: 'United Kingdom',
  GD: 'Grenada', GE: 'Georgia', GF: 'French Guiana', GG: 'Guernsey', GH: 'Ghana', GI: 'Gibraltar',
  GL: 'Greenland', GM: 'Gambia', GN: 'Guinea', GP: 'Guadeloupe', GQ: 'Equatorial Guinea', GR: 'Greece',
  GS: 'South Georgia', GT: 'Guatemala', GU: 'Guam', GW: 'Guinea-Bissau', GY: 'Guyana', HK: 'Hong Kong',
  HM: 'Heard Island and McDonald Islands', HN: 'Honduras', HR: 'Croatia', HT: 'Haiti', HU: 'Hungary',
  ID: 'Indonesia', IE: 'Ireland', IL: 'Israel', IM: 'Isle of Man', IN: 'India', IO: 'British Indian Ocean Territory',
  IQ: 'Iraq', IR: 'Iran', IS: 'Iceland', IT: 'Italy', JE: 'Jersey', JM: 'Jamaica', JO: 'Jordan',
  JP: 'Japan', KE: 'Kenya', KG: 'Kyrgyzstan', KH: 'Cambodia', KI: 'Kiribati', KM: 'Comoros',
  KN: 'Saint Kitts and Nevis', KP: 'North Korea', KR: 'South Korea', KW: 'Kuwait', KY: 'Cayman Islands',
  KZ: 'Kazakhstan', LA: 'Laos', LB: 'Lebanon', LC: 'Saint Lucia', LI: 'Liechtenstein', LK: 'Sri Lanka',
  LR: 'Liberia', LS: 'Lesotho', LT: 'Lithuania', LU: 'Luxembourg', LV: 'Latvia', LY: 'Libya',
  MA: 'Morocco', MC: 'Monaco', MD: 'Moldova', ME: 'Montenegro', MF: 'Saint Martin', MG: 'Madagascar',
  MH: 'Marshall Islands', MK: 'North Macedonia', ML: 'Mali', MM: 'Myanmar', MN: 'Mongolia', MO: 'Macau',
  MP: 'Northern Mariana Islands', MQ: 'Martinique', MR: 'Mauritania', MS: 'Montserrat', MT: 'Malta',
  MU: 'Mauritius', MV: 'Maldives', MW: 'Malawi', MX: 'Mexico', MY: 'Malaysia', MZ: 'Mozambique',
  NA: 'Namibia', NC: 'New Caledonia', NE: 'Niger', NF: 'Norfolk Island', NG: 'Nigeria', NI: 'Nicaragua',
  NL: 'Netherlands', NO: 'Norway', NP: 'Nepal', NR: 'Nauru', NU: 'Niue', NZ: 'New Zealand',
  OM: 'Oman', PA: 'Panama', PE: 'Peru', PF: 'French Polynesia', PG: 'Papua New Guinea', PH: 'Philippines',
  PK: 'Pakistan', PL: 'Poland', PM: 'Saint Pierre and Miquelon', PN: 'Pitcairn Islands', PR: 'Puerto Rico',
  PS: 'Palestine', PT: 'Portugal', PW: 'Palau', PY: 'Paraguay', QA: 'Qatar', RE: 'Réunion',
  RO: 'Romania', RS: 'Serbia', RU: 'Russia', RW: 'Rwanda', SA: 'Saudi Arabia', SB: 'Solomon Islands',
  SC: 'Seychelles', SD: 'Sudan', SE: 'Sweden', SG: 'Singapore', SH: 'Saint Helena', SI: 'Slovenia',
  SJ: 'Svalbard and Jan Mayen', SK: 'Slovakia', SL: 'Sierra Leone', SM: 'San Marino', SN: 'Senegal',
  SO: 'Somalia', SR: 'Suriname', SS: 'South Sudan', ST: 'São Tomé and Príncipe', SV: 'El Salvador',
  SX: 'Sint Maarten', SY: 'Syria', SZ: 'Eswatini', TC: 'Turks and Caicos Islands', TD: 'Chad',
  TF: 'French Southern Territories', TG: 'Togo', TH: 'Thailand', TJ: 'Tajikistan', TK: 'Tokelau',
  TL: 'Timor-Leste', TM: 'Turkmenistan', TN: 'Tunisia', TO: 'Tonga', TR: 'Turkey', TT: 'Trinidad and Tobago',
  TV: 'Tuvalu', TW: 'Taiwan', TZ: 'Tanzania', UA: 'Ukraine', UG: 'Uganda', UM: 'U.S. Outlying Islands',
  US: 'United States', UY: 'Uruguay', UZ: 'Uzbekistan', VA: 'Vatican City', VC: 'Saint Vincent and the Grenadines',
  VE: 'Venezuela', VG: 'British Virgin Islands', VI: 'U.S. Virgin Islands', VN: 'Vietnam', VU: 'Vanuatu',
  WF: 'Wallis and Futuna', WS: 'Samoa', XK: 'Kosovo', YE: 'Yemen', YT: 'Mayotte', ZA: 'South Africa',
  ZM: 'Zambia', ZW: 'Zimbabwe'
};

const getCountryName = (code) => {
  if (!code) return 'Unknown';
  const cleanCode = code.trim().toUpperCase();
  return COUNTRY_NAMES[cleanCode] || code;
};


export default function Analytics() {
  const { urlId } = useParams();
  const navigate = useNavigate();
  const { analytics, getAnalytics, loading } = useUrlStore();
  const [days, setDays] = useState(7);

  useEffect(() => {
    if (urlId) {
      getAnalytics(urlId, days).catch(() => toast.error('Failed to load analytics'));
    }
  }, [urlId, days, getAnalytics]);

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const visitSummary = useMemo(() => {
    if (!analytics?.analytics?.recentVisits) return [];
    return Object.entries(
      analytics.analytics.recentVisits.reduce((acc, visit) => {
        const ref = visit.referrer || 'Direct';
        acc[ref] = (acc[ref] || 0) + 1;
        return acc;
      }, {})
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [analytics]);

  if (loading) {
    return (
      <div className="container-custom py-10 text-center">
        <p className="text-[#6B7280]">Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container-custom py-10">
        <button
          onClick={() => navigate('/urls')}
          className="flex items-center gap-2 text-[#4F46E5] hover:text-[#4338CA] mb-4"
        >
          <ArrowLeft size={18} /> Back to links
        </button>
        <p className="text-[#6B7280]">Unable to load analytics for this link.</p>
      </div>
    );
  }

  const { byDevice = [], byBrowser = [], byOS = [], byCountry = [], dailyTrend = [], recentVisits = [] } = analytics.analytics;
  const trafficSource = byDevice[0]?._id || 'Device';
  const topOS = byOS[0]?._id || 'OS';

  return (
    <div className="container-custom py-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-10">
        <div>
          <p className="badge-soft">Analytics</p>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold text-[#1E1B4B]">Link performance</h1>
          <p className="mt-3 max-w-3xl text-lg text-[#6B7280]">Review deep insights for your short URL, including traffic trends, device behavior, and visitor sources.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button type="button" onClick={() => navigate('/urls')} className="btn-secondary w-full md:w-auto">
            <ArrowLeft size={18} /> Back
          </button>
          <button type="button" onClick={() => handleCopyUrl(analytics.shortUrl)} className="btn-primary w-full md:w-auto">
            Copy link
          </button>
        </div>
      </div>

      <div className="analytics-card mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Link</p>
            <p className="mt-3 text-2xl font-semibold text-[#1E1B4B] break-words">{analytics.shortUrl}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[7, 30, 90].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDays(option)}
                className={`px-4 py-2 rounded-2xl text-sm font-semibold ${days === option ? 'bg-[#4F46E5] text-white' : 'bg-[#EFF6FF] text-[#1E1B4B] hover:bg-[#E0E7FF]'}`}
              >
                Last {option} days
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-4 mb-8">
        <div className="metric-card">
          <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Total clicks</p>
          <p className="mt-4 text-4xl font-semibold text-[#1E1B4B]">{analytics.totalClicks.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Period clicks</p>
          <p className="mt-4 text-4xl font-semibold text-[#1E1B4B]">{analytics.period.clicksInPeriod.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Avg clicks / day</p>
          <p className="mt-4 text-4xl font-semibold text-[#1E1B4B]">{Math.round(analytics.period.clicksInPeriod / days).toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Recent visits</p>
          <p className="mt-4 text-4xl font-semibold text-[#1E1B4B]">{recentVisits.length}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr] mb-8">
        <div className="analytics-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Daily trend</p>
              <h2 className="text-2xl font-semibold text-[#1E1B4B]">Click performance</h2>
            </div>
            <span className="badge-soft">{days} day view</span>
          </div>
          <div className="h-80">
            {dailyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="_id" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#FFFFFF', borderColor: '#E0E7FF' }} labelStyle={{ color: '#1E1B4B' }} itemStyle={{ color: '#1E1B4B' }} />
                  <Line type="monotone" dataKey="clicks" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid h-full place-items-center rounded-[1.75rem] bg-[#F8FAFF] text-[#6B7280]">
                No trend data available yet.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="analytics-card">
            <h3 className="text-2xl font-semibold text-[#1E1B4B] mb-5">Device mix</h3>
            <div className="grid gap-4">
              {byDevice.map((item, index) => (
                <div key={item._id || index} className="rounded-[1.75rem] bg-[#F8FAFF] p-4 border border-[#E0E7FF]">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium text-[#1E1B4B]">{item._id}</p>
                    <p className="font-semibold text-[#4F46E5]">{item.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-card">
            <h3 className="text-2xl font-semibold text-[#1E1B4B] mb-5">Operating systems</h3>
            <div className="grid gap-4">
              {byOS.map((item, index) => (
                <div key={item._id || index} className="rounded-[1.75rem] bg-[#F8FAFF] p-4 border border-[#E0E7FF]">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium text-[#1E1B4B]">{item._id}</p>
                    <p className="font-semibold text-[#4F46E5]">{item.count}</p>
                  </div>
                </div>
              ))}
              {byOS.length === 0 && (
                <p className="text-sm text-[#6B7280]">No OS data available yet.</p>
              )}
            </div>
          </div>

          <div className="analytics-card">
            <h3 className="text-2xl font-semibold text-[#1E1B4B] mb-5">Browser share</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byBrowser} layout="vertical" margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
                <XAxis type="number" stroke="#94A3B8" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="_id" stroke="#94A3B8" tick={{ fontSize: 12 }} width={90} />
                <Tooltip contentStyle={{ background: '#FFFFFF', borderColor: '#E0E7FF' }} labelStyle={{ color: '#1E1B4B' }} itemStyle={{ color: '#1E1B4B' }} />
                <Bar dataKey="count" fill="#4F46E5" radius={[8, 8, 8, 8]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="analytics-card">
          <div className="flex items-center justify-between mb-6">
            <div>
                <p className="text-sm uppercase tracking-[0.28em] text-[#6B7280]">Traffic sources</p>
                <h2 className="text-2xl font-semibold text-[#1E1B4B]">Top referrers</h2>
              </div>
              <span className="badge-soft">{visitSummary.length} sources</span>
            </div>
            <div className="grid gap-4">
              {visitSummary.length > 0 ? visitSummary.map(([referrer, count], index) => (
                <div key={`${referrer}-${index}`} className="rounded-[1.75rem] bg-[#F8FAFF] p-4 border border-[#E0E7FF]">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium text-[#1E1B4B] truncate">{referrer}</p>
                    <span className="text-[#4F46E5] font-semibold">{count}</span>
                  </div>
                  <p className="text-sm text-[#6B7280] mt-2">{Math.round((count / Math.max(1, recentVisits.length)) * 100)}% of recent visits</p>
                </div>
              )) : (
                <p className="text-[#6B7280]">No referrer data yet.</p>
              )}
            </div>
          </div>

        <div className="space-y-6">
          <div className="analytics-card">
            <h3 className="text-2xl font-semibold text-[#1E1B4B] mb-5">Top regions</h3>
            <div className="space-y-4">
              {byCountry.slice(0, 5).map((country, index) => (
                <div key={country._id || index} className="rounded-[1.75rem] bg-[#F8FAFF] p-4 border border-[#E0E7FF]">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[#1E1B4B] font-medium">{getCountryName(country._id)}</p>
                    <p className="text-[#4F46E5] font-semibold">{country.clicks}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-card">
            <h3 className="text-2xl font-semibold text-[#1E1B4B] mb-5">AI insight</h3>
            <div className="rounded-[1.75rem] bg-[#F8FAFF] p-6 border border-[#E0E7FF]">
              <p className="text-lg font-semibold text-[#1E1B4B]">Audience momentum</p>
              <p className="mt-4 leading-7 text-[#6B7280]">
                Your traffic pattern is strongest on {trafficSource} devices. Focus on mobile-friendly CTAs and QR sharing to accelerate conversions.
              </p>
              <ul className="mt-5 space-y-3 text-[#6B7280]">
                <li>• The top browser is {byBrowser[0]?._id || 'Chrome'}.</li>
                <li>• The most active operating system is {topOS}.</li>
                <li>• {getCountryName(byCountry[0]?._id) || 'Global'} drives your highest volume.</li>
                <li>• Keep links fresh and share from high-performing campaigns.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
