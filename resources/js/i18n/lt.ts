// Lithuanian translations for the E-Auction application
export const lt = {
  // Common
  common: {
    home: 'Pradžia',
    dashboard: 'Skydelis',
    auctions: 'Aukcionai',
    myAuctions: 'Mano aukcionai',
    settings: 'Nustatymai',
    profile: 'Profilis',
    password: 'Slaptažodis',
    logout: 'Atsijungti',
    login: 'Prisijungti',
    register: 'Registruotis',
    email: 'El. paštas',
    name: 'Vardas',
    save: 'Išsaugoti',
    cancel: 'Atšaukti',
    delete: 'Ištrinti',
    edit: 'Redaguoti',
    create: 'Sukurti',
    search: 'Ieškoti',
    loading: 'Kraunama...',
    saved: 'Išsaugota',
    actions: 'Veiksmai',
    back: 'Atgal',
    next: 'Kitas',
    previous: 'Ankstesnis',
    confirm: 'Patvirtinti',
    close: 'Uždaryti',
    yes: 'Taip',
    no: 'Ne',
    admin: 'Administratorius',
    switchProfile: 'Perjungti profilį',
    seller: 'Pardavėjas',
    buyer: 'Pirkėjas',
    guest: 'Svečias',
    warning: 'Įspėjimas',
  },

  // Authentication
  auth: {
    loginTitle: 'Prisijunkite prie savo paskyros',
    loginDescription:
      'Įveskite savo el. paštą ir slaptažodį, kad prisijungtumėte',
    registerTitle: 'Sukurkite paskyrą',
    registerDescription:
      'Įveskite savo duomenis žemiau, kad sukurtumėte paskyrą',
    forgotPasswordTitle: 'Pamiršote slaptažodį',
    forgotPasswordDescription:
      'Įveskite savo el. paštą, kad gautumėte slaptažodžio atkūrimo nuorodą',
    resetPasswordTitle: 'Atkurti slaptažodį',
    verifyEmailTitle: 'Patvirtinkite el. paštą',
    verifyEmailDescription:
      'Prašome patvirtinti savo el. pašto adresą spustelėję nuorodą, kurią ką tik jums išsiuntėme.',
    twoFactorTitle: 'Dviejų faktorių autentifikacija',
    emailAddress: 'El. pašto adresas',
    emailPlaceholder: 'vardas@pvz.com',
    passwordPlaceholder: 'Slaptažodis',
    currentPassword: 'Dabartinis slaptažodis',
    newPassword: 'Naujas slaptažodis',
    confirmPassword: 'Patvirtinkite slaptažodį',
    rememberMe: 'Prisiminti mane',
    forgotPassword: 'Pamiršote slaptažodį?',
    dontHaveAccount: 'Neturite paskyros?',
    alreadyHaveAccount: 'Jau turite paskyrą?',
    createAccount: 'Sukurti paskyrą',
    fullName: 'Pilnas vardas',
    emailPasswordResetLink: 'Siųsti slaptažodžio atkūrimo nuorodą',
    orReturnTo: 'Arba grįžti į',
    resetPassword: 'Atkurti slaptažodį',
    resendVerification: 'Siųsti patvirtinimo el. laišką dar kartą',
    verificationLinkSent:
      'Naujas patvirtinimo el. laiškas išsiųstas į jūsų el. pašto adresą.',
    emailUnverified: 'Jūsų el. pašto adresas nepatvirtintas.',
    clickToResend:
      'Spustelėkite čia, kad dar kartą išsiųstumėte patvirtinimo el. laišką.',
  },

  // Auction
  auction: {
    title: 'Pavadinimas',
    description: 'Aprašymas',
    startingPrice: 'Pradinė kaina',
    currentBid: 'Dabartinis pasiūlymas',
    bidIncrement: 'Pasiūlymo prieaugis',
    endTime: 'Pabaigos laikas',
    status: 'Būsena',
    active: 'Aktyvus',
    sold: 'Parduotas',
    expired: 'Pasibaigęs',
    seller: 'Pardavėjas',
    winner: 'Laimėtojas',
    buyer: 'Pirkėjas',
    images: 'Nuotraukos',
    createAuction: 'Sukurti aukcioną',
    editAuction: 'Redaguoti aukcioną',
    deleteAuction: 'Ištrinti aukcioną',
    placeBid: 'Pateikti pasiūlymą',
    bidAmount: 'Pasiūlymo suma',
    minBid: 'Minimalus pasiūlymas',
    auctionEnd: 'Aukciono pabaiga',
    ends: 'Baigiasi',
    ended: 'Pasibaigė',
    ongoingAuctions: 'Vykstantys aukcionai',
    endedAuctions: 'Pasibaigę aukcionai',
    wonAuctions: 'Laimėti aukcionai',
    yourRecentAuctions: 'Jūsų naujausi aukcionai',
    recentlyWonAuctions: 'Neseniai laimėti aukcionai',
    noAuctionsYet: 'Dar nesukūrėte jokių aukcionų.',
    noEndedAuctions: 'Neturite pasibaigusių aukcionų.',
    noWonAuctions: 'Dar nesate laimėję jokių aukcionų.',
    youCannotBidOwnAuction: 'Negalite pateikti pasiūlymo savo aukcionui',
    bidPlacedSuccessfully: 'Pasiūlymas sėkmingai pateiktas',
    uploadMoreFiles: 'Įkelti daugiau failų',
    dragAndDropOrClick:
      'Nuvilkite ir paleiskite arba spustelėkite, kad įkeltumėte',
    finalPrice: 'Galutinė kaina',
    noWinner: 'Nėra laimėtojo',
    yourBid: 'Jūsų pasiūlymas',
    increment: 'Prieaugis',
    needLogin: 'Turite būti prisijungę',
    placing: 'Pateikiama…',
    noActiveAuctions: 'Nėra aktyvių aukcionų',
    checkBackLater: 'Užeikite vėliau, kad pamatytumėte naujus skelbimus.',
    sellerAuctions: ':count aukcionai',
  },

  // Comments
  comments: {
    comments: 'Komentarai',
    addComment: 'Pridėti komentarą',
    writeComment: 'Rašyti komentarą...',
    postComment: 'Skelbti komentarą',
    noComments: 'Dar nėra komentarų',
    postedComment: 'Komentaras paskelbtas',
    loginToComment: 'Prisijunkite, kad komentuotumėte',
    posting: 'Skelbiama…',
  },

  // Settings
  settings: {
    profileSettings: 'Profilio nustatymai',
    passwordSettings: 'Slaptažodžio nustatymai',
    twoFactorAuth: 'Dviejų faktorių autentifikacija',
    appearance: 'Išvaizda',
    appearanceDescription: 'Atnaujinkite savo paskyros išvaizdos nustatymus',
    profileInformation: 'Profilio informacija',
    updateProfileInfo: 'Atnaujinkite savo vardą ir el. pašto adresą',
    updatePassword: 'Atnaujinti slaptažodį',
    ensureSecurePassword:
      'Užtikrinkite, kad jūsų paskyra naudoja ilgą, atsitiktinį slaptažodį, kad būtų saugi',
    savePassword: 'Išsaugoti slaptažodį',
    deleteAccount: 'Ištrinti paskyrą',
    deleteAccountDescription: 'Ištrinkite savo paskyrą ir visus jos išteklius',
    deleteAccountWarning:
      'Ištrinus paskyrą, visi jos ištekliai ir duomenys bus visam laikui ištrinti. Prieš ištrinant paskyrą, atsisiųskite visus duomenis ar informaciją, kurią norite išsaugoti.',
    deleteAccountCaution: 'Prašome būti atsargiems — to atšaukti negalima.',
    deleteAccountConfirmPassword:
      'Įveskite savo slaptažodį, kad patvirtintumėte visam laikui ištrinti savo paskyrą.',
    deleteAccountConfirm: 'Ar tikrai norite ištrinti savo paskyrą?',
    twoFactorEnabled: 'Įjungta',
    twoFactorDisabled: 'Išjungta',
    enable2FA: 'Įjungti 2FA',
    disable2FA: 'Išjungti 2FA',
    continueSetup: 'Tęsti sąranką',
    twoFactorDescription:
      'Įjungus dviejų faktorių autentifikaciją, prisijungimo metu būsite paraginti įvesti saugų, atsitiktinį PIN kodą, kurį galite gauti iš TOTP palaikančios programos savo telefone.',
    twoFactorDisabledDescription:
      'Kai įjungsite dviejų faktorių autentifikaciją, prisijungimo metu būsite paraginti įvesti saugų PIN kodą. Šį PIN kodą galima gauti iš TOTP palaikančios programos savo telefone.',
    recoveryCodes: 'Atkūrimo kodai',
    recoveryCodesDescription:
      'Išsaugokite šiuos atkūrimo kodus saugioje vietoje. Juos galima naudoti atkurti prieigą prie paskyros, jei prarasite dviejų faktorių autentifikacijos įrenginį.',
    regenerateRecoveryCodes: 'Iš naujo generuoti atkūrimo kodus',
    showRecoveryCodes: 'Rodyti atkūrimo kodus',
    manageProfileSettings: 'Valdykite savo profilį ir paskyros nustatymus',
    appearanceOptions: {
      light: 'Šviesus',
      dark: 'Tamsus',
      system: 'Pagal sistemą',
    },
  },

  // Admin
  admin: {
    admin: 'Administratorius',
    users: 'Vartotojai',
    usersManagement: 'Vartotojų valdymas',
    allUsers: 'Visi vartotojai',
    id: 'ID',
    ipAddress: 'IP adresas',
    status: 'Būsena',
    role: 'Rolė',
    auctionsCreated: 'Sukurti aukcionai',
    itemsBought: 'Nupirkti daiktai',
    registered: 'Registruotas',
    noUsersFound: 'Vartotojų nerasta.',
    blocked: 'Užblokuotas',
    active: 'Aktyvus',
    blockUser: 'Užblokuoti vartotoją',
    unblockUser: 'Atblokuoti vartotoją',
    makeAdmin: 'Padaryti administratoriumi',
    removeAdmin: 'Pašalinti administratoriaus teises',
  },

  // Email templates
  email: {
    auctionSold: {
      subject: 'Jūsų daiktas parduotas!',
      goodNews: 'Gera žinia — jūsų daiktas parduotas!',
      greeting: 'Sveiki',
      message: 'Jūsų aukcionas "{title}" baigėsi ir buvo parduotas {buyer}.',
      finalPrice: 'Galutinė kaina:',
      buyerEmail: 'Pirkėjo el. paštas:',
      auctionId: 'Aukciono ID:',
      endedAt: 'Pasibaigė:',
      nextSteps:
        'Toliau koordinuokite pristatymą ir mokėjimą su pirkėju. Jei jūsų platforma tai palaiko, galite valdyti užsakymo vykdymą savo skydelyje.',
      thanks: 'Dėkojame, kad naudojate E‑Auction!',
    },
  },

  // Validation (will be used in backend)
  validation: {
    required: 'Šis laukas yra privalomas.',
    email: 'El. pašto adresas turi būti galiojantis.',
    min: 'Šis laukas turi būti bent :min simbolių.',
    max: 'Šis laukas negali būti ilgesnis nei :max simbolių.',
    confirmed: 'Patvirtinimas nesutampa.',
    unique: 'Ši reikšmė jau naudojama.',
    numeric: 'Šis laukas turi būti skaičius.',
    after: 'Ši data turi būti vėlesnė nei :date.',
    image: 'Failas turi būti nuotrauka.',
    mimes: 'Failas turi būti šio tipo: :values.',
  },

  // Navigation
  nav: {
    repository: 'Saugykla',
    documentation: 'Dokumentacija',
  },

  // Messages
  messages: {
    success: 'Veiksmas sėkmingai atliktas!',
    error: 'Įvyko klaida. Bandykite dar kartą.',
    unauthorized: 'Neturite teisių atlikti šį veiksmą.',
    notFound: 'Puslapis nerastas.',
    serverError: 'Serverio klaida. Bandykite dar kartą vėliau.',
  },
};

export type TranslationKey = typeof lt;
