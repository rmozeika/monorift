-- Table: public.groups

-- DROP TABLE public.groups;

CREATE TABLE public.groups
(
    gid integer NOT NULL DEFAULT nextval('groups_gid_seq'::regclass),
    name text COLLATE pg_catalog."default" NOT NULL,
    creator integer,
    src jsonb,
    CONSTRAINT groups_pkey PRIMARY KEY (gid),
    CONSTRAINT name UNIQUE (name),
    CONSTRAINT uid FOREIGN KEY (creator)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.groups
    OWNER to "Bobby";