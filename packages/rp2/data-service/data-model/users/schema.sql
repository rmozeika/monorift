-- Table: public.users

-- DROP TABLE public.users;

CREATE TABLE public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    username text COLLATE pg_catalog."default" NOT NULL,
    mongo_id character(24) COLLATE pg_catalog."default" NOT NULL,
    src jsonb,
    email text COLLATE pg_catalog."default",
    mocked boolean,
    oauth_id character varying COLLATE pg_catalog."default" NOT NULL,
    guest boolean,
    gravatar text COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to "Bobby";