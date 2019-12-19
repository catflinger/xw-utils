import { ClueGroup } from 'src/app/model/interfaces';

export type LineType = 
    
    // contains whitespace only
    "empty" |

    // contains unidentified text
    "unknown" |

    // contains a whole clue eg "12 This is a clue (4)"
    "clue" |

    // contains the start of a clue but no end eg "12 This is a very long"
    "partialClueStart" |

    // contains the end of a clue, but not the start eg "end of a clue (8)"
    "partialClueEnd" |

    // contains an across marker, typically "ACROSS"
    "acrossMarker" |

    // contains a down marker, typically "DOWN"
    "downMarker";

