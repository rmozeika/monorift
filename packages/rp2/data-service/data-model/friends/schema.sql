-- Table: public.friendship

-- DROP TABLE public.friendship;

CREATE TABLE public.friendship
(
    member1_id integer NOT NULL,
    member2_id integer NOT NULL,
    status "char",
    mocked boolean,
    CONSTRAINT member1_id FOREIGN KEY (member1_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT member2_id FOREIGN KEY (member2_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.friendship
    OWNER to "Bobby";