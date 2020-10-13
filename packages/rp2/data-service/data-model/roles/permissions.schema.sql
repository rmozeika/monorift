CREATE TABLE public.permissions (
  id  integer NOT NULL DEFAULT nextval('roles_id_seq'::regclass),
  name text not null,
  description text,
  CONSTRAINT permissions_pkey PRIMARY KEY (id),
  CONSTRAINT name UNIQUE (name),
  CONSTRAINT uid FOREIGN KEY (role_id)
    REFERENCES public.roles (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.members
    OWNER to "Bobby";