CREATE TABLE public.userroles (
  uid integer not null,
  role_id integer not null,
  PRIMARY KEY(uid, role_id)
  CONSTRAINT uid FOREIGN KEY (uid)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID,
  CONSTRAINT uid FOREIGN KEY (role_id)
    REFERENCES public.roles (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID,
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.members
    OWNER to "Bobby";