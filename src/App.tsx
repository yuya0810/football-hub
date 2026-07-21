import { useEffect, useState } from "react";
import "./App.css";

type Match = {
	id: number;
	date: string;
	league: string;
	status: string;
	home: string;
	homeLogo: string;
	homeScore: number | null;
	away: string;
	awayLogo: string;
	awayScore: number | null;
};

type ApiMatch = {
	id: number;
	utcDate: string;
	competition: {
		name: string;
	};
	homeTeam: {
		name: string;
		shortName: string;
		crest: string;
	};
	awayTeam: {
		name: string;
		shortName: string;
		crest: string;
	};
	score: {
		fullTime: {
			home: number | null;
			away: number | null;
		};
	};
};

type ApiResponse = {
	matches: ApiMatch[];
};

function App() {
	const [matches, setMatches] = useState<Match[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [selectedDate, setSelectedDate] = useState(
		new Intl.DateTimeFormat("en-CA", {
			timeZone: "Asia/Tokyo",
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		}).format(new Date()),
	);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);

	useEffect(() => {
		const loadMatches = async () => {
			try {
				const response = await fetch("http://localhost:8080/api/matches");

				if (!response.ok) {
					throw new Error("試合日程の取得に失敗しました");
				}

				const data: ApiResponse = await response.json();

				const formattedMatches: Match[] = data.matches.map((match) => ({
					id: match.id,
					date: new Intl.DateTimeFormat("en-CA", {
						timeZone: "Asia/Tokyo",
						year: "numeric",
						month: "2-digit",
						day: "2-digit",
					}).format(new Date(match.utcDate)),
					league: match.competition.name,
					status: new Intl.DateTimeFormat("ja-JP", {
						hour: "2-digit",
						minute: "2-digit",
					}).format(new Date(match.utcDate)),
					home: match.homeTeam.shortName || match.homeTeam.name,
					homeLogo: match.homeTeam.crest,
					homeScore: match.score.fullTime.home,
					away: match.awayTeam.shortName || match.awayTeam.name,
					awayLogo: match.awayTeam.crest,
					awayScore: match.score.fullTime.away,
				}));

				setMatches(formattedMatches);
			} catch {
				setError("試合日程を取得できませんでした");
			} finally {
				setLoading(false);
			}
		};

		void loadMatches();
	}, []);
	const selectedMatches = matches.filter(
		(match) => match.date === selectedDate,
	);

	const selectedDateLabel = new Intl.DateTimeFormat("ja-JP", {
		dateStyle: "long",
		timeZone: "UTC",
	}).format(new Date(`${selectedDate}T00:00:00Z`));
	const addDays = (dateKey: string, days: number) => {
		const date = new Date(`${dateKey}T00:00:00Z`);
		date.setUTCDate(date.getUTCDate() + days);
		return date.toISOString().slice(0, 10);
	};

	const todayKey = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Asia/Tokyo",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date());

	const getDateLabel = (dateKey: string) => {
		if (dateKey === todayKey) return "今日";
		if (dateKey === addDays(todayKey, -1)) return "昨日";
		if (dateKey === addDays(todayKey, 1)) return "明日";

		return new Intl.DateTimeFormat("ja-JP", {
			weekday: "short",
			month: "numeric",
			day: "numeric",
			timeZone: "UTC",
		}).format(new Date(`${dateKey}T00:00:00Z`));
	};

	const dateTabs = [-2, -1, 0, 1, 2].map((offset) => {
		const dateKey = addDays(selectedDate, offset);

		return {
			dateKey,
			label: getDateLabel(dateKey),
		};
	});
	const seasonMonths = Array.from({ length: 10 }, (_, index) => {
		const firstDate = new Date(Date.UTC(2026, 7 + index, 1));
		const year = firstDate.getUTCFullYear();
		const month = firstDate.getUTCMonth();

		return {
			year,
			month,
			firstWeekday: firstDate.getUTCDay(),
			daysInMonth: new Date(Date.UTC(year, month + 1, 0)).getUTCDate(),
		};
	});

	const matchCountByDate = matches.reduce<Record<string, number>>(
		(counts, match) => {
			counts[match.date] = (counts[match.date] ?? 0) + 1;
			return counts;
		},
		{},
	);

	return (
		<div className="app">
			<header className="header">
				<div className="header-main">
					<strong className="brand">Football Hub</strong>

					<div className="header-actions">
						<button
							type="button"
							aria-label="今日へ移動"
							onClick={() => setSelectedDate(todayKey)}
						>
							◷
						</button>

						<button
							type="button"
							className="calendar-action"
							aria-label="シーズンカレンダーを開く"
							onClick={() => setIsCalendarOpen(true)}
						>
							<span>{Number(selectedDate.slice(-2))}</span>
						</button>

						<button type="button" aria-label="メニュー">
							☰
						</button>
					</div>
				</div>

				<nav className="date-strip">
					{dateTabs.map((date) => (
						<button
							type="button"
							key={date.dateKey}
							className={
								date.dateKey === selectedDate ? "date-tab active" : "date-tab"
							}
							onClick={() => setSelectedDate(date.dateKey)}
						>
							{date.label}
						</button>
					))}
				</nav>
			</header>

			<main className="main">
				<p className="label">LIVE SCORES</p>
				<h1 className="selected-date-title">{selectedDateLabel}</h1>

				{loading && <p>日程を読み込んでいます...</p>}
				{error && <p>{error}</p>}
				<section className="match-list">
					{selectedMatches.map((match) => (
						<article className="match-card" key={match.id}>
							<div className="match-info">
								<span>{match.league}</span>
							</div>

							<div className="match-row">
								<div className="club club-home">
									<strong>{match.home}</strong>
									<img src={match.homeLogo} alt={match.home} />
								</div>

								<span className="match-score">
									{match.homeScore === null
										? match.status
										: `${match.homeScore} - ${match.awayScore}`}
								</span>

								<div className="club club-away">
									<img src={match.awayLogo} alt={match.away} />
									<strong>{match.away}</strong>
								</div>
							</div>
						</article>
					))}
				</section>
			</main>
			{isCalendarOpen && (
				<div
					className="calendar-overlay"
					onClick={() => setIsCalendarOpen(false)}
				>
					<div
						className="season-calendar"
						onClick={(event) => event.stopPropagation()}
					>
						<div className="calendar-heading">
							<h2>2026/27 シーズン</h2>

							<button
								type="button"
								aria-label="カレンダーを閉じる"
								onClick={() => setIsCalendarOpen(false)}
							>
								×
							</button>
						</div>

						<div className="season-months">
							{seasonMonths.map((calendarMonth) => (
								<section
									className="calendar-month"
									key={`${calendarMonth.year}-${calendarMonth.month}`}
								>
									<h3>
										{calendarMonth.year}年{calendarMonth.month + 1}月
									</h3>

									<div className="calendar-weekdays">
										{["日", "月", "火", "水", "木", "金", "土"].map(
											(weekday) => (
												<span key={weekday}>{weekday}</span>
											),
										)}
									</div>

									<div className="calendar-days">
										{Array.from(
											{ length: calendarMonth.firstWeekday },
											(_, index) => (
												<span
													className="calendar-empty"
													key={`empty-${calendarMonth.year}-${calendarMonth.month}-${index}`}
												/>
											),
										)}

										{Array.from(
											{ length: calendarMonth.daysInMonth },
											(_, index) => {
												const day = index + 1;

												const dateKey = [
													calendarMonth.year,
													String(calendarMonth.month + 1).padStart(2, "0"),
													String(day).padStart(2, "0"),
												].join("-");

												const matchCount = matchCountByDate[dateKey] ?? 0;
												const isSelected = dateKey === selectedDate;

												return (
													<button
														type="button"
														key={dateKey}
														className={[
															"calendar-day",
															matchCount > 0 ? "has-match" : "",
															isSelected ? "selected" : "",
														].join(" ")}
														onClick={() => {
															setSelectedDate(dateKey);
															setIsCalendarOpen(false);
														}}
													>
														<span>{day}</span>

														{matchCount > 0 && <small>{matchCount}</small>}
													</button>
												);
											},
										)}
									</div>
								</section>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
export default App;
