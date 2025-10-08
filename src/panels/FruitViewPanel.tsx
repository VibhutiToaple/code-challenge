import { useState } from "react";
import {
  Card,
  Form,
  Select,
  InputNumber,
  Button,
  Typography,
  List,
  message as antdMessage,
} from "antd";
import { constants } from "@utils/constants";

import { Fruit } from "../types/types";
import { MockFruitMachine } from "../../engine/MockFruitMachine";

export const FruitViewPanel = () => {
  const { Option } = Select;
  const { Title, Text } = Typography;

  const fruitList: Fruit[] = ["apple", "banana", "orange"];
  const machine = new MockFruitMachine();

  const [inventory, setInventory] = useState(machine.getInventory());
  const [selectedFruit, setSelectedFruit] = useState<Fruit>("apple");
  const [amount, setAmount] = useState(1);
  const [message, setMessage] = useState("");

  const handleBuy = () => {
    if (machine.buy(selectedFruit, amount)) {
      setMessage(constants.fruitViewPanel.setBoughtMessage(amount.toString(), selectedFruit));
      antdMessage.success(
        constants.fruitViewPanel.setBoughtMessage(amount.toString(), selectedFruit)
      );
    } else {
      setMessage(constants.fruitViewPanel.setEnoughMessage(selectedFruit));
      antdMessage.error(constants.fruitViewPanel.setEnoughMessage(selectedFruit));
    }
    setInventory(machine.getInventory());
  };

  const handleSell = () => {
    machine.sell(selectedFruit, amount);
    setMessage(constants.fruitViewPanel.setSoldMessage(amount.toString(), selectedFruit));
    antdMessage.info(constants.fruitViewPanel.setSoldMessage(amount.toString(), selectedFruit));
    setInventory(machine.getInventory());
  };

  return (
    <div className="panels">
      <Card className="fruit-view-panel">
        <Title level={3} className="panel-header">
          {constants.fruitViewPanel.header}
        </Title>
        <Form className="fruit-form" layout="inline" onSubmitCapture={(e) => e.preventDefault()}>
          <Form.Item label={constants.fruitViewPanel.fruitLabel}>
            <Select
              value={selectedFruit}
              onChange={(value) => setSelectedFruit(value)}
              style={{ width: 120 }}>
              {fruitList.map((fruit) => (
                <Option key={fruit} value={fruit}>
                  {fruit}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label={constants.fruitViewPanel.amoutLabel}>
            <InputNumber
              min={1}
              value={amount}
              onChange={(value) => setAmount(Number(value))}
              style={{ width: 80 }}
            />
          </Form.Item>
          <Form.Item>
            <Button className="button" type="primary" onClick={handleBuy}>
              {constants.fruitViewPanel.buyButton}
            </Button>
            <Button type="default" onClick={handleSell}>
              {constants.fruitViewPanel.sellButton}
            </Button>
          </Form.Item>
        </Form>
        <div style={{ minHeight: 24, marginBottom: 16 }}>
          {message && (
            <Text
              strong
              style={{
                color: message.startsWith(constants.fruitViewPanel.boughtLabel)
                  ? "#52c41a"
                  : message.startsWith(constants.fruitViewPanel.notEnoughLabel)
                    ? "#f5222d"
                    : undefined,
              }}>
              {message}
            </Text>
          )}
        </div>
        <Title level={4} style={{ marginBottom: 8 }}>
          {constants.fruitViewPanel.inventoryLabel}
        </Title>
        <List
          size="small"
          dataSource={fruitList}
          renderItem={(fruit) => (
            <List.Item style={{ padding: "4px 0" }}>
              <Text style={{ color: "blue", fontSize: 16 }}>
                {fruit}:{" "}
                <Text strong style={{ color: "#000" }}>
                  {inventory[fruit]}
                </Text>
              </Text>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};
