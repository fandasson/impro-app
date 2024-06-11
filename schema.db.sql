-- this schema my not be up-to-date
-- PostgreSQL on Supabase platform was used

create table performances
(
    id         serial
        primary key,
    url_slug   text                not null,
    intro_text text                not null,
    name       text                not null,
    date       date                not null,
    note       text,
    state      "performance-state" not null
);

create table players
(
    id    serial
        primary key,
    name  varchar(255) not null,
    quest boolean default false
);

create table performances_players
(
    player_id      integer not null
        constraint performance_players_player_id_fkey
            references players
            on delete cascade,
    performance_id integer not null
        constraint performance_players_performance_id_fkey
            references performances
            on delete cascade,
    constraint performance_players_pkey
        primary key (player_id, performance_id)
);

create table questions_pool
(
    id                  integer generated by default as identity
        primary key,
    name                text,
    performance_id      integer               not null
        references performances
            on update cascade on delete cascade,
    audience_visibility boolean default false not null
);

create table questions
(
    id                  serial
        primary key,
    name                text                                                      not null,
    question            text                                                      not null,
    performance_id      integer                                                   not null
        references performances,
    index_order         integer                                                   not null,
    multiple            boolean             default false                         not null,
    state               "question-state"                                          not null,
    type                "question-type"     default 'text'::"question-type"       not null,
    pool_id             integer
                                                                                  references questions_pool
                                                                                      on delete set null,
    audience_visibility audience_visibility default 'hidden'::audience_visibility not null
);

create table answers_text
(
    id          integer default nextval('answers_id_seq'::regclass) not null
        constraint answers_pkey
            primary key,
    question_id integer                                             not null
        constraint answers_question_id_fkey
            references questions,
    user_id     uuid                                                not null,
    value       text                                                not null
);

create table questions_players
(
    question_id integer not null
        constraint question_players_question_id_fkey
            references questions
            on delete cascade,
    player_id   integer not null
        constraint question_players_player_id_fkey
            references players
            on delete cascade,
    constraint question_players_pkey
        primary key (question_id, player_id)
);

create table answers_match
(
    id          serial
        primary key,
    question_id integer not null
        references questions
            on delete cascade,
    player_id   integer not null
        references players
            on delete cascade,
    user_id     uuid    not null,
    value       text    not null
);

create table answers_vote
(
    id          integer default nextval('answer_votes_id_seq'::regclass) not null
        constraint answer_votes_pkey
            primary key,
    question_id integer                                                  not null
        constraint answer_votes_question_id_fkey
            references questions
            on delete cascade,
    player_id   integer                                                  not null
        constraint answer_votes_player_id_fkey
            references players
            on delete cascade,
    user_id     uuid                                                     not null,
    constraint answer_votes_question_id_player_id_user_id_key
        unique (question_id, player_id, user_id)
);