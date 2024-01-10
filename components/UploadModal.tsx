"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import { Song } from "@/types";
import { supabase } from "@/supabase";
import getSongs from "@/actions/getSongs";
import useUser from "@/hooks/useUser";

const validationSchema = Yup.object({
  title: Yup.string().required("Song title is required"),
  artist: Yup.string().required("Artist name is required"),
  song: Yup.string()
    .required("Song URL is required")
    .test("valid-url", "Please enter a valid song URL", (value) => {
      try {
        new URL(value);
        return true;
      } catch (error) {
        return false;
      }
    }),
  image: Yup.string()
    .required("Image URL is required")
    .test("valid-url", "Please enter a valid image URL", (value) => {
      try {
        new URL(value);
        return true;
      } catch (error) {
        return false;
      }
    }),
});

const UploadModal = () => {
  const uploadModal = useUploadModal();
  const [isLoading, setisLoading] = useState(false);
  const user = useUser();
  const router = useRouter();

  const initialValues = {
    title: "",
    artist: "",
    song: "",
    image: "",
  };

  const onChange = (open: boolean) => {
    if (!open) {
      uploadModal.onClose();
    }
  };
  type FormValues = {
    title: string;
    artist: string;
    song: string;
    image: string;
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setisLoading(true);

      const songs = await getSongs();
      const isSongExists = songs.some(
        (song: Song) =>
          (song.title.toLowerCase() === values.title.toLowerCase() &&
            song.artist.toLowerCase() === values.artist.toLowerCase()) ||
          song.cover === values.image ||
          song.songPath === values.song
      );
      if (isSongExists) {
        toast.error("Song already exists!");
        setisLoading(false);
        return;
      }

      const { error: uploadError } = await supabase.from("songs").insert({
        title: values.title,
        artist: values.artist,
        songPath: values.song,
        cover: values.image,
        user_id: user.id,
      });
      if (uploadError) {
        throw new Error("Failed to upload song to Supabase");
      }

      setisLoading(false);
      toast.success("Song created!");
      uploadModal.onClose();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong! Please try again");
    } finally {
      setisLoading(false);
    }
  };

  return (
    <Modal
      title="Add a song"
      description="Write URL of Song "
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form className="flex  flex-col gap-y-4">
          <Field
            id="title"
            as={Input}
            disabled={isLoading}
            name="title"
            placeholder="Song title"
          />
          <ErrorMessage
            name="title"
            component="span"
            className="text-red-500"
          />

          <Field
            id="artist"
            as={Input}
            disabled={isLoading}
            name="artist"
            placeholder="Artist Name"
          />
          <ErrorMessage
            name="artist"
            component="span"
            className="text-red-500"
          />

          <div className="pb-1">
            <div>Write a song URL</div>
            <Field id="song" as={Input} disabled={isLoading} name="song" />
            <ErrorMessage
              name="song"
              component="span"
              className="text-red-500"
            />
          </div>

          <div className="pb-1">
            <div>Write an image URL</div>
            <Field id="image" as={Input} disabled={isLoading} name="image" />
            <ErrorMessage
              name="image"
              component="span"
              className="text-red-500"
            />
          </div>

          <Button disabled={isLoading} type="submit" className="bg-purple-500">
            Create
          </Button>
        </Form>
      </Formik>
    </Modal>
  );
};

export default UploadModal;
