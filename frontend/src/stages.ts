abstract class Stage {
    public readonly id: number
    public readonly path: string

    constructor(id: number, path: string) {
        this.id = id
        this.path = path
    }
}

class Building extends Stage {
    public npcs: NonPlayable[]
    constructor(id: number, path: string) {
        super(id, path)
    }
}

class Outdoors extends Stage {
    constructor(id: number, path: string) {
        super(id, path)
    }
}

class Cutscene extends Stage {
    constructor(id: number, path: string) {
        super(id, path)
    }
}