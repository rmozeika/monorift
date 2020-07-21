CREATE TABLE public.roles (
  id  integer NOT NULL DEFAULT nextval('roles_id_seq'::regclass),
  name text not null,
  description text,
  CONSTRAINT roles_pkey PRIMARY KEY (id),
  CONSTRAINT name UNIQUE (name)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.members
    OWNER to "Bobby";