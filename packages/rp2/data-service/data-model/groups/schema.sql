-- Table: public.groups

-- DROP TABLE public.groups;

CREATE TABLE public.groups
(
    gid serial NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT groups_pkey PRIMARY KEY (gid),
    CONSTRAINT name UNIQUE (name)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.groups
    OWNER to "Bobby";