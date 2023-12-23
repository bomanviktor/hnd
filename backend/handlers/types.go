package handlers

type Difficulty uint8

const (
	Easy Difficulty = iota + 1
	Medium
	Hard
)

type Direction uint8

const (
	North Direction = iota
	East
	South
	West
	Up
	Down
)

type Game struct {
	stage      Stage
	players    []Player
	difficulty Difficulty
}

type Stage struct {
	id         int
	directions map[Direction]Stage // 0 = NORTH, 1 = EAST, 2 = SOUTH, 3 = WEST, 4 = UP, 5 = DOWN
	buildings  []Stage
	npcs       []Character
}

type Character struct {
	name      string
	race      string
	hp        int
	level     int
	stats     Stats
	inventory []any
}

type Player struct {
	Character
	abilities []Ability
	hasLight  bool
}

type Npc struct {
	Character
	canBeKilled bool
	loot        any
}

type Trader struct {
	Npc
	willTrade bool
}

type Neutral struct {
	Trader
	abilities []Ability
}

type Friendly struct {
	Trader
	abilities []Ability
}

type Enemy struct {
	Npc
	abilities []Ability
}

type Boss struct {
	Enemy
	specialAbilities []Ability
}

type Stats struct {
	damage   int
	armor    int
	block    int
	movement int
}

type Ability struct {
	used    bool
	level   int
	effects any
}
