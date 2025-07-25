import {
  Avatar,
  Badge,
  Button,
  Center,
  FileInput,
  Group,
  Image,
  Loader,
  Modal,
  NumberFormatter,
  Paper,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import {
  getImageUrl,
  uploadPaymentProof,
  verifyPayment,
} from "../utils/databaseHelper";

function PaymentRow({
  name,
  url,
  amount,
  status,
  isPayment = false,
  meta,
  isOrg = false,
}) {
  if (!name) name = "Anonymous";
  const [opened, { open, close }] = useDisclosure(false);
  const [openedImg, { open: openImg, close: closeImg }] = useDisclosure(false);
  const [file, setFile] = useState();
  const queryClient = useQueryClient();
  const { data: proof_url, isLoading } = useQuery({
    queryKey: ["payment-proof", meta?.id],
    queryFn: () => getImageUrl(meta?.id),
    enabled: !!meta?.id && openedImg,
  });
  const { mutate: uploadProof, isPending } = useMutation({
    mutationKey: ["uploadProof"],
    mutationFn: (values) => uploadPaymentProof(values),
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Proof uploaded successfully",
        color: "green",
      });
      queryClient.refetchQueries(["payments"]);
      close();
    },
  });
  const { mutate: verifyPaymentById, isPending: isVerifying } = useMutation({
    mutationKey: ["verifyPayment", meta?.id],
    mutationFn: (id) => verifyPayment(id),
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Payment verified successfully",
        color: "green",
      });
      queryClient.refetchQueries(["payments"]);
      close();
    },
  });
  const handleUpload = () => {
    if (!file) {
      notifications.show({
        title: "Error",
        message: "Please select a file",
        color: "red",
      });
    } else {
      uploadProof({
        file: file,
        committee_id: meta?.committee_id,
        member_id: meta?.member_id,
        id: meta?.id,
      });
    }
  };
  return (
    <Paper withBorder radius="md" p={"xs"} shadow="xs" pos={"relative"}>
      <Stack>
        <Group>
          <Group>
            <Avatar src={url} radius="xl" name={name} color="initials" />
            <Stack gap={0}>
              <Text size="sm" fw={600}>
                {name}
              </Text>
              <Text size="sm" fw={700}>
                <NumberFormatter
                  value={amount}
                  displayType="text"
                  thousandSeparator=","
                  decimalSeparator="."
                  prefix="Rs. "
                />
              </Text>
            </Stack>
          </Group>

          <Group pos={"absolute"} right={10} top={5}>
            <Stack gap={4} justify="center">
              {status && (
                <Badge color={colorsForStatus[status]} variant="dot" size="xs">
                  {status}
                </Badge>
              )}

              {isOrg && meta?.status === "uploaded" && (
                <Button
                  onClick={() => verifyPaymentById(meta?.id)}
                  loading={isVerifying}
                  color="green"
                  variant="light"
                  rightSection={<IoMdCheckmarkCircle />}
                  size="xs"
                >
                  Verify
                </Button>
              )}
            </Stack>
          </Group>
        </Group>{" "}
        <Modal opened={opened} onClose={close} title="Payment Proof">
          <Stack>
            <FileInput
              accept="image/*"
              label="Upload Payment Proof"
              description="File must be an image  less than 2mb"
              placeholder="Click here to upload payment proof"
              value={file}
              onChange={setFile}
            />
            <Button onClick={handleUpload} loading={isPending}>
              Upload
            </Button>
          </Stack>
        </Modal>
        <Modal opened={openedImg} onClose={closeImg} title="Payment Proof">
          {(isPayment || isOrg) && meta?.status === "uploaded" && !isLoading ? (
            <ScrollArea type="auto" offsetScrollbars>
              <Image src={proof_url} fit="contain"></Image>
            </ScrollArea>
          ) : (
            <Center>
              <Loader></Loader>
            </Center>
          )}
        </Modal>
        {isPayment && meta?.status === "pending" && (
          <Text
            size="xs"
            c="dimmed"
            onClick={open}
            style={{ cursor: "pointer" }}
          >
            Click to upload payment proof
          </Text>
        )}
        {(isPayment || isOrg) && meta?.status === "uploaded" && (
          <Stack gap={1} pt={4}>
            <Text size="xs" c="lime">
              Payment proof uploaded successfully
            </Text>
            <Text
              size="xs"
              c="orange"
              style={{ cursor: "pointer" }}
              onClick={() => openImg()}
            >
              Click Here to view proof
            </Text>{" "}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

export default PaymentRow;

const colorsForStatus = {
  pending: "yellow",
  uploaded: "blue",
  rejected: "red",
  verified: "green",
};
