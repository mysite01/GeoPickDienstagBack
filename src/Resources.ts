export type PlayerResource = {
    id?: string
    nickName: string
    createdAt?: string 
    joinedAtInTeam?: string | null;
    leftAtInTeam?: string | null;
    host:Boolean;
    teamId:string | null;
    
}

export interface GameResource {
    id?: string;
    title: string;
    beschreibung?: string;
    POIs?: {
        type: string;
        coordinates: [number, number];
    }[];
    poilId?: string[]; 
    maxTeam: number; 
    userId: string; 
}

export type GameInstanceResource = {
    id?: string;
    name?: string;
    status: number; 
    startTime: string; 
    endTime: string;
    gameID: string;
    teamsID: string[];
}

export type TeamResource = {
    id?: string;
    name: string;
    codeInvite: string;
    qaCode: string;
    shareUrl:string;
    createdAt?: string;
    poiId: string[];
    poiPoints: number[];
    playersID: string[]; // must del
};
export type UserResource = {
    id?: string;
    name: string;
    password?: string;
    createdAt?: Date;
    email?: string;
    verificationToken?: string | null; // Token für E-Mail-Verifizierung
};

export type POIResource = {
    id?: string;
    name: string;
    lat: number;
    long: number;
    beschreibung: string;
    punkte: number;
};

export type LoginResource = {
    id: string;        
    token: string;     
    expiresAt?: Date;  
};
export interface POIListResource {
    id?: string;
    name: string; 
    poilId: string[]; 
}
