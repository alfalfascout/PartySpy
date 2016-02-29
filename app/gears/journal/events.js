export var EVENT_CODES = {
    MDl: "Spy ran out of time.",
    MWw: "Missions completed successfully.",
    MWc: "Missions completed. %.0f second countdown.",
    MWp: "Missions completed. Countdown pending.",
    SnS: "Sniper shot Spy.",
    Sns: "Sniper shot civilian.",
    Snl: "Sniper shot too late for sync.",
    New: "Game started.",
    OT: "Overtime!",
    ChT: "%.0f seconds added to match.",
    Cht: "%.0f seconds subtracted from match.",
    Rst: "Missions reset.",
    BTt: "Transferred microfilm.",
    BAb: "Bugged Ambassador in conversation.",
    BAB: "Bugged Ambassador while walking.",
    DAc: "Double Agent contacted.",
    SSS: "Statue swapped.",
    STS: "Target seduced.",
    ISI: "All statues inspected.",
    GLP: "Guest List purloined.",
    GLR: "Guest List returned.",
    FAF: "Fingerprinted Ambassador.",
    ChW: "Watch checked to add time.",
    ChC: "Aborted watch check to add time.",
    DAC: "Fake Banana Bread uttered.",
    DAu: "Banana Bread uttered.",
    DAx: "Banana Bread aborted.",
    DAX: "Left alone while attempting Banana Bread.",
    BTH: "Hide microfilm in book.",
    BTh: "Remove microfilm from book.",
    STf: "Flirt with seduction target: %d%%",
    STn: "Failed flirt with seduction target.",
    ISi: "Held statue inspected.",
    ISr: "Right statue inspected.",
    ISl: "Left statue inspected.",
    ISc: "Inspection interrupted.",
    SSd: "Dropped statue.",
    GLx: "Purloin Guest List aborted.",
    GLX: "Return Guest List aborted.",
    GLd: "Delegating Purloin Guest List.",
    GLt: "Delegated Purloin timer expired.",
    GLD: "Delegated Purloin to %s.",
    FAf: "Fingerprinted %s.",
    ATb: "Action test red: %s",
    ATn: "Action test white: %s",
    ATg: "Action test green: %s",
    ATi: "Action test ignored: %s",
    ATc: "Action test canceled: %s",
    DRs: "Sipped drink.",
    DRC: "Gulped drink.",
    DRS: "Took last sip of drink.",
    DRg: "Got drink from waiter.",
    DRr: "Rejected drink from waiter.",
    DRR: "Request drink from waiter.",
    DRo: "Waiter offered drink.",
    DRX: "Waiter stopped offering drink.",
    DRG: "Waiter gave up.",
    DBg: "Got drink from bartender.",
    DBr: "Rejected drink from bartender.",
    DBR: "Request drink from bartender.",
    DBD: "Demand drink from bartender.",
    DBo: "Bartender offered drink.",
    DBX: "Bartender stopped offering drink.",
    DBG: "Bartender gave up.",
    DBx: "Gave up on bartender.",
    DBc: "Bartender picked next customer.",
    DAt: "Stopped talking.",
    DAT: "Started talking.",
    DAI: "Interrupted speaker.",
    DAj: "Double Agent left conversation with Spy.",
    DAJ: "Double Agent joined conversation with Spy.",
    DAk: "Spy left conversation with Double Agent.",
    DAK: "Spy joined conversation with Double Agent.",
    Chw: "Watch checked.",
    SSg: "Picked up statue.",
    SSP: "Statue swap pending.",
    SSp: "Put back statue.",
    SSc: "Character picked up pending statue.",
    SSC: "Cast member picked up pending statue.",
    GLp: "Guest List purloin pending.",
    GLr: "Guest List return pending.",
    BTr: "Read book.",
    BTg: "Get book from bookcase.",
    BTp: "Put book in bookcase.",
    BAp: "Begin planting bug in conversation.",
    BAP: "Begin planting bug while walking.",
    BAL: "Ambassador's personal space violated.",
    DAr: "Real Banana Bread started.",
    DAf: "Fake Banana Bread started.",
    STb: "Begin flirtation with seduction target.",
    STr: "Flirtation cooldown expired.",
    STC: "Seduction canceled.",
    Sai: "Spy player takes control from AI.",
    SAI: "AI takes over Spy character.",
    Cnv: "Spy enters conversation.",
    CnV: "Spy leaves conversation.",
    Lwn: "Spy looks out window.",
    Lpn: "Spy looks at painting.",
    Brp: "Spy picks up briefcase.",
    BrP: "Spy puts down briefcase.",
    Brr: "Spy returns briefcase.",
    FAg: "Picked up fingerprintable %s.",
    FAG: "Picked up fingerprintable %s (difficult).",
    FAb: "Started fingerprinting %s.",
    FAc: "Fingerprinting canceled.",
    FAx: "Fingerprinting failed.",
    BAc: "Ambassador cast.",
    BAC: "Ambassador cast.", //manually
    DAp: "Double Agent cast.",
    DAQ: "Double Agent cast.", //manually
    DAP: "Suspected Double Agent cast.",
    STc: "Seduction Target cast.",
    STQ: "Seduction Target cast.", //manually
    SPc: "Spy cast.",
    SPC: "Spy cast.",  //manually
    Snp: "Took shot.",
    MkH: "Marked %smost suspicious.",
    Mkh: "Marked %ssuspicious.",
    Mkn: "Marked %sneutral suspicion.",
    Mkl: "Marked %sless suspicious.",
    MkL: "Marked %sleast suspicious.",
    Mkb: "Marked book.",
    LZR: "Laser event.",
    GLs: "Purloin Guest List Selected",
    GLe: "Purloin Guest List Enabled",
    BTs: "Transfer Microfilm Selected",
    BTe: "Transfer Microfilm Enabled",
    BAs: "Bug Ambassador Selected",
    BAe: "Bug Ambassador Enabled",
    FAs: "Fingerprint Ambassador Selected",
    FAe: "Fingerprint Ambassador Enabled",
    DAs: "Contact Double Agent Selected",
    DAe: "Contact Double Agent Enabled",
    ISs: "Inspect Statue Selected",
    ISe: "Inspect Statue Enabled",
    STs: "Seduce Target Selected",
    STe: "Seduce Target Enabled",
    SSs: "Swap Statue Selected",
    SSe: "Swap Statue Enabled",
    Cnt: "Conversation current talker",
    Cnp: "Conversation previous talker",
    Cnn: "Conversation next talker"
};

export var IGNORABLE_EVENTS = new Set([
    "LZR", //laser event
    "Cnt", //conversation next talker
    "Cnp", //conversation previous talker
    "Cnn"  //conversation next talker
]);

export var IMAGE_EVENTS = new Set([
   "Mkh", //highlight
   "Mkn", //neutral
   "Mkl" //lowlight
]);

export var COLORS = {
    MDl: "#992699", // "Spy ran out of time.",
    MWw: "#992699", // "Missions completed successfully.",
    MWc: "#992699", // "Missions completed. %.0f second countdown.",
    MWp: "#992699", // "Missions completed. Countdown pending.",
    SnS: "#992699", // "Sniper shot Spy.",
    Sns: "#992699", // "Sniper shot civilian.",
    Snl: "#992699", // "Sniper shot too late for sync.",
    New: "#992699", // "Game started.",
    OT: "#001CA1", //"Overtime!",
    ChT: "#001CA1", // "%.0f seconds added to match.",
    Cht: "#001CA1", // "%.0f seconds subtracted from match.",
    Rst: "#001CA1", // "Missions reset.",
    BTt: "#001CA1", // "Transferred microfilm.",
    BAb: "#001CA1", // "Bugged Ambassador in conversation.",
    BAB: "#001CA1", // "Bugged Ambassador while walking.",
    DAc: "#001CA1", // "Double Agent contacted.",
    SSS: "#001CA1", // "Statue swapped.",
    STS: "#001CA1", // "Target seduced.",
    ISI: "#001CA1", // "All statues inspected.",
    GLP: "#001CA1", // "Guest List purloined.",
    GLR: "#001CA1", // "Guest List returned.",
    FAF: "#001CA1", // "Fingerprinted Ambassador.",
    ChW: "#001CA1", // "Watch checked to add time.",
    ChC: "#001CA1", // "Aborted watch check to add time.",
    DAC: "#001CA1", // "Fake Banana Bread uttered.",
    DAu: "#001CA1", // "Banana Bread uttered.",
    DAx: "#001CA1", // "Banana Bread aborted.",
    DAX: "#001CA1", // "Left alone while attempting Banana Bread.",
    BTH: "#001CA1", // "Hide microfilm in book.",
    BTh: "#001CA1", // "Remove microfilm from book.",
    STf: "#001CA1", // "Flirt with seduction target: %d%%",
    STn: "#001CA1", // "Failed flirt with seduction target.",
    ISi: "#001CA1", // "Held statue inspected.",
    ISr: "#001CA1", // "Right statue inspected.",
    ISl: "#001CA1", // "Left statue inspected.",
    ISc: "#001CA1", // "Inspection interrupted.",
    SSd: "#001CA1", // "Dropped statue.",
    GLx: "#001CA1", // "Purloin Guest List aborted.",
    GLX: "#001CA1", // "Return Guest List aborted.",
    GLd: "#008087", // "Delegating Purloin Guest List.",
    GLt: "#008087", // "Delegated Purloin timer expired.",
    GLD: "#008087", // "Delegated Purloin to %s.",
    FAf: "#008087", // "Fingerprinted %s.",
    ATb: "#008087", // "Action test red: %s",
    ATn: "#008087", // "Action test white: %s",
    ATg: "#008087", // "Action test green: %s",
    ATi: "#008087", // "Action test ignored: %s",
    ATc: "#008087", // "Action test canceled: %s",
    DRs: "#008087", // "Sipped drink.",
    DRC: "#008087", // "Gulped drink.",
    DRS: "#008087", // "Took last sip of drink.",
    DRg: "#008087", // "Got drink from waiter.",
    DRr: "#008087", // "Rejected drink from waiter.",
    DRR: "#008087", // "Request drink from waiter.",
    DRo: "#008087", // "Waiter offered drink.",
    DRX: "#008087", // "Waiter stopped offering drink.",
    DRG: "#008087", // "Waiter gave up.",
    DBg: "#008087", // "Got drink from bartender.",
    DBr: "#008087", // "Rejected drink from bartender.",
    DBR: "#008087", // "Request drink from bartender.",
    DBD: "#008087", // "Demand drink from bartender.",
    DBo: "#008087", // "Bartender offered drink.",
    DBX: "#008087", // "Bartender stopped offering drink.",
    DBG: "#008087", // "Bartender gave up.",
    DBx: "#008087", // "Gave up on bartender.",
    DBc: "#008087", // "Bartender picked next customer.",
    DAt: "#008087", // "Stopped talking.",
    DAT: "#008087", // "Started talking.",
    DAI: "#008087", // "Interrupted speaker.",
    DAj: "#008087", // "Double Agent left conversation with Spy.",
    DAJ: "#008087", // "Double Agent joined conversation with Spy.",
    DAk: "#008087", // "Spy left conversation with Double Agent.",
    DAK: "#008087", // "Spy joined conversation with Double Agent.",
    Chw: "#008087", // "Watch checked.",
    SSg: "#008087", // "Picked up statue.",
    SSP: "", // "Statue swap pending.",
    SSp: "#008087", // "Put back statue.",
    SSc: "", // "Character picked up pending statue.",
    SSC: "", // "Cast member picked up pending statue.",
    GLp: "", // "Guest List purloin pending.",
    GLr: "", // "Guest List return pending.",
    BTr: "#008087", // "Read book.",
    BTg: "#008087", // "Get book from bookcase.",
    BTp: "#008087", // "Put book in bookcase.",
    BAp: "#008087", // "Begin planting bug in conversation.",
    BAP: "#008087", // "Begin planting bug while walking.",
    BAL: "#008087", // "Ambassador's personal space violated.",
    DAr: "#008087", // "Real Banana Bread started.",
    DAf: "#008087", // "Fake Banana Bread started.",
    STb: "#008087", // "Begin flirtation with seduction target.",
    STr: "#008087", // "Flirtation cooldown expired.",
    STC: "#008087", // "Seduction canceled.",
    Sai: "#008087", // "Spy player takes control from AI.",
    SAI: "#008087", // "AI takes over Spy character.",
    Cnv: "#008087", // "Spy enters conversation.",
    CnV: "#008087", // "Spy leaves conversation.",
    Lwn: "#008087", // "Spy looks out window.",
    Lpn: "#008087", // "Spy looks at painting.",
    Brp: "#008087", // "Spy picks up briefcase.",
    BrP: "#008087", // "Spy puts down briefcase.",
    Brr: "#008087", // "Spy returns briefcase.",
    FAg: "#008087", // "Picked up fingerprintable %s.",
    FAG: "#008087", // "Picked up fingerprintable %s (difficult).",
    FAb: "#008087", // "Started fingerprinting %s.",
    FAc: "#008087", // "Fingerprinting canceled.",
    FAx: "#008087", // "Fingerprinting failed.",
    BAc: "#333366", // "Ambassador cast.",
    BAC: "#333366", // "Ambassador cast.", //manually
    DAp: "#333366", // "Double Agent cast.",
    DAQ: "#333366", // "Double Agent cast.", //manually
    DAP: "#333366", // "Suspected Double Agent cast.",
    STc: "#333366", // "Seduction Target cast.",
    STQ: "#333366", // "Seduction Target cast.", //manually
    SPc: "#333366", // "Spy cast.",
    SPC: "#333366", // "Spy cast.",  //manually
    Snp: "#870D00", // "Took shot.",
    MkH: "#877805", // "Marked %smost suspicious.",
    Mkh: "#877805", // "Marked %ssuspicious.",
    Mkn: "#877805", // "Marked %sneutral suspicion.",
    Mkl: "#877805", // "Marked %sless suspicious.",
    MkL: "#877805", // "Marked %sleast suspicious.",
    Mkb: "#877805", // "Marked book.",
    LZR: "#877805", // "Laser event.",
    GLs: "#333366", // "Purloin Guest List Selected",
    GLe: "#333366", // "Purloin Guest List Enabled",
    BTs: "#333366", // "Transfer Microfilm Selected",
    BTe: "#333366", // "Transfer Microfilm Enabled",
    BAs: "#333366", // "Bug Ambassador Selected",
    BAe: "#333366", // "Bug Ambassador Enabled",
    FAs: "#333366", // "Fingerprint Ambassador Selected",
    FAe: "#333366", // "Fingerprint Ambassador Enabled",
    DAs: "#333366", // "Contact Double Agent Selected",
    DAe: "#333366", // "Contact Double Agent Enabled",
    ISs: "#333366", // "Inspect Statue Selected",
    ISe: "#333366", // "Inspect Statue Enabled",
    STs: "#333366", // "Seduce Target Selected",
    STe: "#333366", // "Seduce Target Enabled",
    SSs: "#333366", // "Swap Statue Selected",
    SSe: "#333366", // "Swap Statue Enabled",
    Cnt: "#333366", // "Conversation current talker",
    Cnp: "#333366", // "Conversation previous talker",
    Cnn: "#333366"  // "Conversation next talker"
};
