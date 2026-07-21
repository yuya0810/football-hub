import "./App.css";

const matches = [
	{
		id: 1,
		league: "Premier League",
		atatus: "試合終了",
		home: "Arsenal",
		homeLogo: "https://media.api-sports.io/football/teams/42.png",
		homeScore: 2,
		away: "Chelsea",
		awayLogo: "https://media.api-sports.io/football/teams/49.png",
		awayScore: 1,
	},
	{
		id: 2,
		league: "La LIga",
		status: "20:00",
		home: "Real Madrid",
		homeLogo: "https://media.api-sports.io/football/teams/541.png",
		homeScore: "0",
		away: "Barcelona",
		awayLogo: "https://media.api-sports.io/football/teams/529.png",
		awayScore: "0",
	},
];

function App() {
	const today = new Intl.DateTimeFormat("ja-jp", { dateStyle: "long" }).format(
		new Date(),
	);
	return (
		<div className="app">
			<header className="header">
				<strong>⚽️Football HUb</strong>
				<button>☆お気に入り</button>
			</header>

			<main className="main">
				<p className="label">LIVE SCORES</p>
				<h1>今日の試合</h1>
				<p className="date">{today}</p>

				<section className="match-list">
					{matches.map((match) => (
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
		</div>
	);
}
export default App;
