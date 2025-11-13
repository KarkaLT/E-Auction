<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'Laukas :attribute turi būti priimtas.',
    'accepted_if' => 'Laukas :attribute turi būti priimtas, kai :other yra :value.',
    'active_url' => 'Laukas :attribute nėra galiojantis URL.',
    'after' => 'Laukas :attribute turi būti data po :date.',
    'after_or_equal' => 'Laukas :attribute turi būti data po arba lygi :date.',
    'alpha' => 'Laukas :attribute gali turėti tik raides.',
    'alpha_dash' => 'Laukas :attribute gali turėti tik raides, skaičius, brūkšnelius ir pabraukimus.',
    'alpha_num' => 'Laukas :attribute gali turėti tik raides ir skaičius.',
    'array' => 'Laukas :attribute turi būti masyvas.',
    'ascii' => 'Laukas :attribute gali turėti tik vienbaitius raidžių-skaitmenų simbolius.',
    'before' => 'Laukas :attribute turi būti data prieš :date.',
    'before_or_equal' => 'Laukas :attribute turi būti data prieš arba lygi :date.',
    'between' => [
        'array' => 'Laukas :attribute turi turėti nuo :min iki :max elementų.',
        'file' => 'Laukas :attribute turi būti nuo :min iki :max kilobaitų.',
        'numeric' => 'Laukas :attribute turi būti nuo :min iki :max.',
        'string' => 'Laukas :attribute turi būti nuo :min iki :max simbolių.',
    ],
    'boolean' => 'Laukas :attribute turi būti teisingas arba klaidingas.',
    'can' => 'Laukas :attribute turi neleistiną reikšmę.',
    'confirmed' => 'Laukas :attribute patvirtinimas nesutampa.',
    'contains' => 'Laukui :attribute trūksta reikalingos reikšmės.',
    'current_password' => 'Slaptažodis neteisingas.',
    'date' => 'Laukas :attribute nėra galiojanti data.',
    'date_equals' => 'Laukas :attribute turi būti data lygi :date.',
    'date_format' => 'Laukas :attribute neatitinka formato :format.',
    'decimal' => 'Laukas :attribute turi turėti :decimal dešimtainių skaičių.',
    'declined' => 'Laukas :attribute turi būti atmestas.',
    'declined_if' => 'Laukas :attribute turi būti atmestas, kai :other yra :value.',
    'different' => 'Laukai :attribute ir :other turi skirtis.',
    'digits' => 'Laukas :attribute turi būti :digits skaitmenų.',
    'digits_between' => 'Laukas :attribute turi būti nuo :min iki :max skaitmenų.',
    'dimensions' => 'Laukas :attribute turi neteisingus vaizdo matmenis.',
    'distinct' => 'Laukas :attribute turi pasikartojančią reikšmę.',
    'doesnt_end_with' => 'Laukas :attribute negali baigtis vienu iš šių: :values.',
    'doesnt_start_with' => 'Laukas :attribute negali prasidėti vienu iš šių: :values.',
    'email' => 'Laukas :attribute turi būti galiojantis el. pašto adresas.',
    'ends_with' => 'Laukas :attribute turi baigtis vienu iš šių: :values.',
    'enum' => 'Pasirinktas :attribute yra neteisingas.',
    'exists' => 'Pasirinktas :attribute yra neteisingas.',
    'extensions' => 'Laukas :attribute turi turėti vieną iš šių plėtinių: :values.',
    'file' => 'Laukas :attribute turi būti failas.',
    'filled' => 'Laukas :attribute turi turėti reikšmę.',
    'gt' => [
        'array' => 'Laukas :attribute turi turėti daugiau nei :value elementų.',
        'file' => 'Laukas :attribute turi būti didesnis nei :value kilobaitų.',
        'numeric' => 'Laukas :attribute turi būti didesnis nei :value.',
        'string' => 'Laukas :attribute turi būti ilgesnis nei :value simbolių.',
    ],
    'gte' => [
        'array' => 'Laukas :attribute turi turėti :value elementų ar daugiau.',
        'file' => 'Laukas :attribute turi būti didesnis arba lygus :value kilobaitų.',
        'numeric' => 'Laukas :attribute turi būti didesnis arba lygus :value.',
        'string' => 'Laukas :attribute turi būti ilgesnis arba lygus :value simbolių.',
    ],
    'hex_color' => 'Laukas :attribute turi būti galiojanti šešioliktainė spalva.',
    'image' => 'Laukas :attribute turi būti vaizdas.',
    'in' => 'Pasirinktas :attribute yra neteisingas.',
    'in_array' => 'Laukas :attribute turi egzistuoti :other.',
    'integer' => 'Laukas :attribute turi būti sveikasis skaičius.',
    'ip' => 'Laukas :attribute turi būti galiojantis IP adresas.',
    'ipv4' => 'Laukas :attribute turi būti galiojantis IPv4 adresas.',
    'ipv6' => 'Laukas :attribute turi būti galiojantis IPv6 adresas.',
    'json' => 'Laukas :attribute turi būti galiojanti JSON eilutė.',
    'list' => 'Laukas :attribute turi būti sąrašas.',
    'lowercase' => 'Laukas :attribute turi būti mažosiomis raidėmis.',
    'lt' => [
        'array' => 'Laukas :attribute turi turėti mažiau nei :value elementų.',
        'file' => 'Laukas :attribute turi būti mažesnis nei :value kilobaitų.',
        'numeric' => 'Laukas :attribute turi būti mažesnis nei :value.',
        'string' => 'Laukas :attribute turi būti trumpesnis nei :value simbolių.',
    ],
    'lte' => [
        'array' => 'Laukas :attribute negali turėti daugiau nei :value elementų.',
        'file' => 'Laukas :attribute turi būti mažesnis arba lygus :value kilobaitų.',
        'numeric' => 'Laukas :attribute turi būti mažesnis arba lygus :value.',
        'string' => 'Laukas :attribute turi būti trumpesnis arba lygus :value simbolių.',
    ],
    'mac_address' => 'Laukas :attribute turi būti galiojantis MAC adresas.',
    'max' => [
        'array' => 'Laukas :attribute negali turėti daugiau nei :max elementų.',
        'file' => 'Laukas :attribute negali būti didesnis nei :max kilobaitų.',
        'numeric' => 'Laukas :attribute negali būti didesnis nei :max.',
        'string' => 'Laukas :attribute negali būti ilgesnis nei :max simbolių.',
    ],
    'max_digits' => 'Laukas :attribute negali turėti daugiau nei :max skaitmenų.',
    'mimes' => 'Laukas :attribute turi būti failas tipo: :values.',
    'mimetypes' => 'Laukas :attribute turi būti failas tipo: :values.',
    'min' => [
        'array' => 'Laukas :attribute turi turėti bent :min elementų.',
        'file' => 'Laukas :attribute turi būti bent :min kilobaitų.',
        'numeric' => 'Laukas :attribute turi būti bent :min.',
        'string' => 'Laukas :attribute turi būti bent :min simbolių.',
    ],
    'min_digits' => 'Laukas :attribute turi turėti bent :min skaitmenų.',
    'missing' => 'Laukas :attribute turi būti praleistas.',
    'missing_if' => 'Laukas :attribute turi būti praleistas, kai :other yra :value.',
    'missing_unless' => 'Laukas :attribute turi būti praleistas, nebent :other yra :value.',
    'missing_with' => 'Laukas :attribute turi būti praleistas, kai yra :values.',
    'missing_with_all' => 'Laukas :attribute turi būti praleistas, kai yra :values.',
    'multiple_of' => 'Laukas :attribute turi būti :value kartotinis.',
    'not_in' => 'Pasirinktas :attribute yra neteisingas.',
    'not_regex' => 'Laukas :attribute formatas yra neteisingas.',
    'numeric' => 'Laukas :attribute turi būti skaičius.',
    'password' => [
        'letters' => 'Laukas :attribute turi turėti bent vieną raidę.',
        'mixed' => 'Laukas :attribute turi turėti bent vieną didžiąją ir vieną mažąją raidę.',
        'numbers' => 'Laukas :attribute turi turėti bent vieną skaičių.',
        'symbols' => 'Laukas :attribute turi turėti bent vieną simbolį.',
        'uncompromised' => 'Nurodytas :attribute pasirodė duomenų nutekėjime. Pasirinkite kitą :attribute.',
    ],
    'present' => 'Laukas :attribute turi būti.',
    'present_if' => 'Laukas :attribute turi būti, kai :other yra :value.',
    'present_unless' => 'Laukas :attribute turi būti, nebent :other yra :value.',
    'present_with' => 'Laukas :attribute turi būti, kai yra :values.',
    'present_with_all' => 'Laukas :attribute turi būti, kai yra :values.',
    'prohibited' => 'Laukas :attribute yra draudžiamas.',
    'prohibited_if' => 'Laukas :attribute yra draudžiamas, kai :other yra :value.',
    'prohibited_unless' => 'Laukas :attribute yra draudžiamas, nebent :other yra :values.',
    'prohibits' => 'Laukas :attribute draudžia :other buvimą.',
    'regex' => 'Laukas :attribute formatas yra neteisingas.',
    'required' => 'Laukas :attribute yra privalomas.',
    'required_array_keys' => 'Laukas :attribute turi turėti įrašus: :values.',
    'required_if' => 'Laukas :attribute yra privalomas, kai :other yra :value.',
    'required_if_accepted' => 'Laukas :attribute yra privalomas, kai :other yra priimtas.',
    'required_if_declined' => 'Laukas :attribute yra privalomas, kai :other yra atmestas.',
    'required_unless' => 'Laukas :attribute yra privalomas, nebent :other yra :values.',
    'required_with' => 'Laukas :attribute yra privalomas, kai yra :values.',
    'required_with_all' => 'Laukas :attribute yra privalomas, kai yra :values.',
    'required_without' => 'Laukas :attribute yra privalomas, kai nėra :values.',
    'required_without_all' => 'Laukas :attribute yra privalomas, kai nėra nė vieno iš :values.',
    'same' => 'Laukai :attribute ir :other turi sutapti.',
    'size' => [
        'array' => 'Laukas :attribute turi turėti :size elementų.',
        'file' => 'Laukas :attribute turi būti :size kilobaitų.',
        'numeric' => 'Laukas :attribute turi būti :size.',
        'string' => 'Laukas :attribute turi būti :size simbolių.',
    ],
    'starts_with' => 'Laukas :attribute turi prasidėti vienu iš šių: :values.',
    'string' => 'Laukas :attribute turi būti eilutė.',
    'timezone' => 'Laukas :attribute turi būti galiojanti laiko juosta.',
    'unique' => 'Laukas :attribute jau užimtas.',
    'uploaded' => 'Nepavyko įkelti :attribute.',
    'uppercase' => 'Laukas :attribute turi būti didžiosiomis raidėmis.',
    'url' => 'Laukas :attribute turi būti galiojantis URL.',
    'ulid' => 'Laukas :attribute turi būti galiojantis ULID.',
    'uuid' => 'Laukas :attribute turi būti galiojantis UUID.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [
        'name' => 'vardas',
        'email' => 'el. paštas',
        'password' => 'slaptažodis',
        'password_confirmation' => 'slaptažodžio patvirtinimas',
        'title' => 'pavadinimas',
        'description' => 'aprašymas',
        'starting_price' => 'pradinė kaina',
        'bid_increment' => 'pasiūlymo prieaugis',
        'end_time' => 'pabaigos laikas',
        'photos' => 'nuotraukos',
        'bid_amount' => 'pasiūlymo suma',
        'body' => 'turinys',
        'current_password' => 'dabartinis slaptažodis',
    ],
];
