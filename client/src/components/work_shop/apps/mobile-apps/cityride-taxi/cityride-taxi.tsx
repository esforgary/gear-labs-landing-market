import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Gauge,
  History,
  KeyRound,
  MapPin,
  Navigation,
  Route,
  Settings,
  ShieldCheck,
  Star,
  UserRound,
  WalletCards,
  Zap,
} from "lucide-react";
import { useThemeLang } from "../../../../../context/ThemeLangContext";
import "./cityride-taxi.scss";

const cityrideCar = new URL("./img/cityride-car.svg", import.meta.url).href;

type CityrideScreen = "ride" | "cars" | "trips" | "profile";
type RideOptionId = "eco" | "comfort" | "business";

type CityrideCopy = {
  previewBadge: string;
  title: string;
  text: string;
  chips: string[];
  phone: {
    brand: string;
    greeting: string;
    location: string;
    nav: Record<CityrideScreen, string>;
    ride: {
      title: string;
      subtitle: string;
      from: string;
      to: string;
      pickup: string;
      destination: string;
      search: string;
      searching: string;
      matched: string;
      cancel: string;
      driver: string;
      plate: string;
      eta: string;
      options: Array<{ id: RideOptionId; title: string; time: string; price: string; note: string }>;
    };
    cars: {
      title: string;
      subtitle: string;
      reserve: string;
      reserved: string;
      unlock: string;
      items: Array<{ name: string; range: string; price: string; place: string }>;
    };
    trips: {
      title: string;
      subtitle: string;
      repeat: string;
      items: Array<{ route: string; date: string; price: string }>;
    };
    profile: {
      title: string;
      subtitle: string;
      rating: string;
      payment: string;
      subscription: string;
      safety: string;
      notifications: string;
      bonus: string;
    };
    messages: {
      carReserved: string;
      carUnlocked: string;
      tripRepeated: string;
      settings: string;
    };
  };
};

const CITYRIDE_COPY: Record<string, CityrideCopy> = {
  ru: {
    previewBadge: "Mobile app",
    title: "CityRide Go",
    text: "Приложение такси и каршеринга: карта маршрута, выбор тарифа, поиск водителя, бронирование авто рядом, история поездок, профиль, оплата и быстрые статусы.",
    chips: ["Такси и каршеринг", "Живая карта", "Бронирование авто", "История поездок"],
    phone: {
      brand: "CityRide",
      greeting: "Добрый день",
      location: "Москва, центр",
      nav: { ride: "Поездка", cars: "Авто", trips: "История", profile: "Профиль" },
      ride: {
        title: "Куда едем?",
        subtitle: "Маршрут, тариф и водитель в одном экране.",
        from: "Откуда",
        to: "Куда",
        pickup: "Тверская 7",
        destination: "Аэропорт SVO",
        search: "Найти водителя",
        searching: "Ищем рядом",
        matched: "Водитель найден",
        cancel: "Отменить",
        driver: "Алексей, Kia K5",
        plate: "A 482 MO",
        eta: "4 мин",
        options: [
          { id: "eco", title: "Eco", time: "5 мин", price: "$8.40", note: "быстро и недорого" },
          { id: "comfort", title: "Comfort", time: "4 мин", price: "$12.90", note: "просторный салон" },
          { id: "business", title: "Business", time: "7 мин", price: "$21.50", note: "премиум авто" },
        ],
      },
      cars: {
        title: "Каршеринг рядом",
        subtitle: "Выберите авто, забронируйте и откройте его из приложения.",
        reserve: "Забронировать",
        reserved: "Забронировано",
        unlock: "Открыть авто",
        items: [
          { name: "Mini Cooper", range: "42 км", price: "$0.21/мин", place: "2 мин пешком" },
          { name: "Tesla Model 3", range: "118 км", price: "$0.39/мин", place: "5 мин пешком" },
          { name: "Kia Rio", range: "76 км", price: "$0.17/мин", place: "рядом с вами" },
        ],
      },
      trips: {
        title: "Последние поездки",
        subtitle: "Повторите маршрут или проверьте стоимость.",
        repeat: "Повторить",
        items: [
          { route: "Дом -> Офис", date: "Сегодня, 09:10", price: "$9.80" },
          { route: "Центр -> SVO", date: "Вчера, 18:30", price: "$22.40" },
          { route: "Коворкинг -> Дом", date: "Пн, 21:05", price: "$11.20" },
        ],
      },
      profile: {
        title: "Мой профиль",
        subtitle: "Оплата, безопасность и бонусы поездок.",
        rating: "4.96 рейтинг",
        payment: "Карта • 8042",
        subscription: "Ride Plus активен",
        safety: "SOS и доверенный контакт",
        notifications: "Уведомления",
        bonus: "320 бонусов",
      },
      messages: {
        carReserved: "Авто забронировано на 12 минут",
        carUnlocked: "Авто открыто. Хорошей поездки",
        tripRepeated: "Маршрут перенесен в поездку",
        settings: "Настройки открыты в профиле",
      },
    },
  },
  en: {
    previewBadge: "Mobile app",
    title: "CityRide Go",
    text: "A taxi and carsharing app with route map, fare choice, driver search, nearby car booking, trip history, profile, payment, and live ride statuses.",
    chips: ["Taxi and carsharing", "Live map", "Car booking", "Trip history"],
    phone: {
      brand: "CityRide",
      greeting: "Good afternoon",
      location: "Downtown",
      nav: { ride: "Ride", cars: "Cars", trips: "Trips", profile: "Profile" },
      ride: {
        title: "Where to?",
        subtitle: "Route, fare, and driver in one screen.",
        from: "Pickup",
        to: "Destination",
        pickup: "Market Street 7",
        destination: "Airport terminal",
        search: "Find driver",
        searching: "Searching nearby",
        matched: "Driver found",
        cancel: "Cancel",
        driver: "Alex, Kia K5",
        plate: "A 482 MO",
        eta: "4 min",
        options: [
          { id: "eco", title: "Eco", time: "5 min", price: "$8.40", note: "fast and simple" },
          { id: "comfort", title: "Comfort", time: "4 min", price: "$12.90", note: "more space" },
          { id: "business", title: "Business", time: "7 min", price: "$21.50", note: "premium car" },
        ],
      },
      cars: {
        title: "Cars nearby",
        subtitle: "Pick a car, reserve it, and unlock from the app.",
        reserve: "Reserve",
        reserved: "Reserved",
        unlock: "Unlock",
        items: [
          { name: "Mini Cooper", range: "42 km", price: "$0.21/min", place: "2 min walk" },
          { name: "Tesla Model 3", range: "118 km", price: "$0.39/min", place: "5 min walk" },
          { name: "Kia Rio", range: "76 km", price: "$0.17/min", place: "near you" },
        ],
      },
      trips: {
        title: "Recent trips",
        subtitle: "Repeat a route or check the final cost.",
        repeat: "Repeat",
        items: [
          { route: "Home -> Office", date: "Today, 09:10", price: "$9.80" },
          { route: "Downtown -> Airport", date: "Yesterday, 18:30", price: "$22.40" },
          { route: "Workspace -> Home", date: "Mon, 21:05", price: "$11.20" },
        ],
      },
      profile: {
        title: "My profile",
        subtitle: "Payment, safety, and ride bonuses.",
        rating: "4.96 rating",
        payment: "Card • 8042",
        subscription: "Ride Plus active",
        safety: "SOS and trusted contact",
        notifications: "Notifications",
        bonus: "320 bonuses",
      },
      messages: {
        carReserved: "Car reserved for 12 minutes",
        carUnlocked: "Car unlocked. Enjoy the ride",
        tripRepeated: "Route moved to ride screen",
        settings: "Settings live in profile",
      },
    },
  },
};

const getCopy = (lang: string) => CITYRIDE_COPY[lang] ?? CITYRIDE_COPY.ru;

export const CityRideTaxiPreview = () => {
  const { lang } = useThemeLang();
  const copy = getCopy(lang);
  const [screen, setScreen] = useState<CityrideScreen>("ride");
  const [rideType, setRideType] = useState<RideOptionId>("comfort");
  const [status, setStatus] = useState<"idle" | "searching" | "matched">("idle");
  const [selectedCar, setSelectedCar] = useState(0);
  const [reservedCar, setReservedCar] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(true);

  const rideOption = useMemo(
    () => copy.phone.ride.options.find((option) => option.id === rideType) ?? copy.phone.ride.options[0],
    [copy.phone.ride.options, rideType],
  );

  useEffect(() => {
    if (status !== "searching") return;
    const timer = window.setTimeout(() => setStatus("matched"), 1050);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2400);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const triggerNotice = (message: string) => setNotice(message);

  const startRide = () => {
    if (status === "searching") return;
    if (status === "matched") {
      setStatus("idle");
      return;
    }
    setStatus("searching");
  };

  const repeatTrip = (route: string) => {
    setScreen("ride");
    setStatus("idle");
    triggerNotice(`${copy.phone.messages.tripRepeated}: ${route}`);
  };

  return (
    <div className="mobile-app-preview mobile-app-preview--cityride">
      <div className="mobile-app-preview__device">
        <div className="app-phone-frame app-phone-frame--cityride">
          <div className="cityride-phone-app">
            <div className="cityride-phone-app__notch" />
            <header className="cityride-topbar">
              <div>
                <span>{copy.phone.greeting}</span>
                <strong>{copy.phone.brand}</strong>
                <small>
                  <MapPin size={12} />
                  {copy.phone.location}
                </small>
              </div>
              <div className="cityride-topbar__actions">
                <button type="button" onClick={() => setScreen("profile")} aria-label={copy.phone.nav.profile}>
                  <UserRound size={18} />
                </button>
                <button type="button" onClick={() => triggerNotice(copy.phone.messages.settings)} aria-label="Settings">
                  <Settings size={18} />
                </button>
              </div>
            </header>

            <main className={`cityride-screen cityride-screen--${screen}`}>
              {screen === "ride" && (
                <section className="cityride-panel cityride-ride-panel">
                  <div className="cityride-section-title">
                    <div>
                      <h3>{copy.phone.ride.title}</h3>
                      <p>{copy.phone.ride.subtitle}</p>
                    </div>
                    <span>{rideOption.price}</span>
                  </div>

                  <div className="cityride-map">
                    <div className="cityride-map__grid" />
                    <svg className="cityride-map__route" viewBox="0 0 300 156" aria-hidden="true">
                      <path d="M40 116 C98 32 158 134 246 42" />
                    </svg>
                    <span className="cityride-map__pin cityride-map__pin--from">
                      <MapPin size={15} />
                    </span>
                    <span className="cityride-map__pin cityride-map__pin--to">
                      <Navigation size={14} />
                    </span>
                    <img className="cityride-map__car cityride-map__car--one" src={cityrideCar} alt="" />
                    <img className="cityride-map__car cityride-map__car--two" src={cityrideCar} alt="" />
                  </div>

                  <div className="cityride-route-box">
                    <div>
                      <span>{copy.phone.ride.from}</span>
                      <strong>{copy.phone.ride.pickup}</strong>
                    </div>
                    <Route size={18} />
                    <div>
                      <span>{copy.phone.ride.to}</span>
                      <strong>{copy.phone.ride.destination}</strong>
                    </div>
                  </div>

                  <div className="cityride-fare-list" role="list">
                    {copy.phone.ride.options.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={option.id === rideType ? "is-active" : ""}
                        onClick={() => {
                          setRideType(option.id);
                          setStatus("idle");
                        }}
                      >
                        <span>
                          <Car size={16} />
                          {option.title}
                        </span>
                        <small>{option.note}</small>
                        <strong>{option.price}</strong>
                        <em>{option.time}</em>
                      </button>
                    ))}
                  </div>

                  <button className={`cityride-main-action is-${status}`} type="button" onClick={startRide}>
                    {status === "idle" && copy.phone.ride.search}
                    {status === "searching" && copy.phone.ride.searching}
                    {status === "matched" && copy.phone.ride.cancel}
                  </button>

                  <div className={`cityride-driver-sheet ${status === "matched" ? "is-visible" : ""}`}>
                    <span>
                      <CheckCircle2 size={16} />
                      {copy.phone.ride.matched}
                    </span>
                    <strong>{copy.phone.ride.driver}</strong>
                    <small>
                      {copy.phone.ride.plate} • {copy.phone.ride.eta}
                    </small>
                  </div>
                </section>
              )}

              {screen === "cars" && (
                <section className="cityride-panel cityride-cars-panel">
                  <div className="cityride-section-title">
                    <div>
                      <h3>{copy.phone.cars.title}</h3>
                      <p>{copy.phone.cars.subtitle}</p>
                    </div>
                    <Zap size={20} />
                  </div>

                  <div className="cityride-carshowcase">
                    <img src={cityrideCar} alt="" />
                    <div>
                      <strong>{copy.phone.cars.items[selectedCar].name}</strong>
                      <span>{copy.phone.cars.items[selectedCar].range}</span>
                    </div>
                  </div>

                  <div className="cityride-car-list">
                    {copy.phone.cars.items.map((carItem, index) => (
                      <button
                        key={carItem.name}
                        type="button"
                        className={selectedCar === index ? "is-active" : ""}
                        onClick={() => setSelectedCar(index)}
                      >
                        <Car size={18} />
                        <span>
                          <strong>{carItem.name}</strong>
                          <small>{carItem.place}</small>
                        </span>
                        <em>{carItem.price}</em>
                      </button>
                    ))}
                  </div>

                  <div className="cityride-action-row">
                    <button
                      type="button"
                      onClick={() => {
                        setReservedCar(selectedCar);
                        triggerNotice(copy.phone.messages.carReserved);
                      }}
                    >
                      <Clock3 size={16} />
                      {reservedCar === selectedCar ? copy.phone.cars.reserved : copy.phone.cars.reserve}
                    </button>
                    <button type="button" onClick={() => triggerNotice(copy.phone.messages.carUnlocked)}>
                      <KeyRound size={16} />
                      {copy.phone.cars.unlock}
                    </button>
                  </div>
                </section>
              )}

              {screen === "trips" && (
                <section className="cityride-panel cityride-trips-panel">
                  <div className="cityride-section-title">
                    <div>
                      <h3>{copy.phone.trips.title}</h3>
                      <p>{copy.phone.trips.subtitle}</p>
                    </div>
                    <History size={20} />
                  </div>

                  <div className="cityride-trip-list">
                    {copy.phone.trips.items.map((trip) => (
                      <button key={trip.route} type="button" onClick={() => repeatTrip(trip.route)}>
                        <span>
                          <strong>{trip.route}</strong>
                          <small>{trip.date}</small>
                        </span>
                        <em>{trip.price}</em>
                        <ChevronRight size={16} />
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {screen === "profile" && (
                <section className="cityride-panel cityride-profile-panel">
                  <div className="cityride-profile-card">
                    <span>
                      <UserRound size={22} />
                    </span>
                    <div>
                      <h3>{copy.phone.profile.title}</h3>
                      <p>{copy.phone.profile.subtitle}</p>
                    </div>
                  </div>
                  <div className="cityride-profile-grid">
                    <button type="button" onClick={() => triggerNotice(copy.phone.profile.rating)}>
                      <Star size={18} />
                      {copy.phone.profile.rating}
                    </button>
                    <button type="button" onClick={() => triggerNotice(copy.phone.profile.payment)}>
                      <CreditCard size={18} />
                      {copy.phone.profile.payment}
                    </button>
                    <button type="button" onClick={() => triggerNotice(copy.phone.profile.subscription)}>
                      <WalletCards size={18} />
                      {copy.phone.profile.subscription}
                    </button>
                    <button type="button" onClick={() => triggerNotice(copy.phone.profile.safety)}>
                      <ShieldCheck size={18} />
                      {copy.phone.profile.safety}
                    </button>
                  </div>
                  <button
                    className={`cityride-toggle ${notifications ? "is-on" : ""}`}
                    type="button"
                    onClick={() => setNotifications((value) => !value)}
                  >
                    <Bell size={18} />
                    <span>{copy.phone.profile.notifications}</span>
                    <i />
                  </button>
                  <div className="cityride-bonus">
                    <Gauge size={18} />
                    <strong>{copy.phone.profile.bonus}</strong>
                  </div>
                </section>
              )}
            </main>

            <nav className="cityride-bottom-nav" aria-label="CityRide navigation">
              {([
                ["ride", Navigation],
                ["cars", Car],
                ["trips", History],
                ["profile", UserRound],
              ] as const).map(([id, Icon]) => (
                <button key={id} type="button" className={screen === id ? "is-active" : ""} onClick={() => setScreen(id)}>
                  <Icon size={18} />
                  <span>{copy.phone.nav[id]}</span>
                </button>
              ))}
            </nav>

            <div className={`cityride-toast ${notice ? "is-visible" : ""}`}>{notice}</div>
          </div>
        </div>
      </div>

      <aside className="mobile-app-preview__copy cityride-preview-copy">
        <span>{copy.previewBadge}</span>
        <h2>{copy.title}</h2>
        <p>{copy.text}</p>
        <div className="cityride-preview-copy__chips">
          {copy.chips.map((chip) => (
            <em key={chip}>{chip}</em>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default CityRideTaxiPreview;
