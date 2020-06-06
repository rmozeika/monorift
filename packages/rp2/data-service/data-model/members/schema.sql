-- Table: public.members

-- DROP TABLE public.members;

CREATE TABLE public.members
(
    uid integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    gid serial,
    CONSTRAINT gid FOREIGN KEY (gid)
        REFERENCES public.groups (gid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT uid FOREIGN KEY (uid)
        REFERENCES public.users (id) MATCH SIMPLE
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