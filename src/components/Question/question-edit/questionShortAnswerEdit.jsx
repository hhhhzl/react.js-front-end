import React, { useState } from "react";
import { Button, Card, Col, Form, Row, Collapse } from "react-bootstrap";
import QuestionShortAnswerDisplay from "../question-display/questionShortAnswerDisplay";

import { useDispatch } from "react-redux";
import {
  updateDraftItemQE,
  deleteDraftItemQE,
  swapDraftItemIndicesQE,
} from "../../../state/slices/question-edit";

export default function QuestionShortAnswerEdit(props) {
  const [qid, setQid] = useState(props.qid || 0);
  const [title, setTitle] = useState(props.title || "");
  const [detail, setDetail] = useState(props.detail || "");
  const [minScore, setMinScore] = useState(props.minScore || 0);
  const [maxScore, setMaxScore] = useState(props.maxScore || 0);
  const [scoringType, setscoringType] = useState(
    props.rubric == 'A'
    ? "A," + props.rubric_detail
    : "E, " || ""
  );
  const dispatch = useDispatch();
  /* display */
  const [displayVisible, setDisplayVisible] = useState(true);
  const [editorVisible, setEditorVisible] = useState(false);

  const setrubric_detail = (string) => {
    console.log(string)
    try {
      JSON.parse(string)
      return JSON.stringify(JSON.parse(string))
    }
    catch(err) {
      console.log(err)
      return string
    }
  }

  const packQuestionData = () => {
    const data = {
      id: qid,
      question_type: 4,
      title: title,
      min_score: minScore,
      max_score: maxScore,
      stem: JSON.stringify({ detail }),
      rubric: scoringType[0],
      rubric_detail: scoringType.slice(2),
    };
    return data;
  };

  const renderEditor = () => {
    return (
      <Form className="question-edit-form">
        <Form.Group as={Row} className="mb-3" controlId="edit--sa--title">
          <Form.Label column sm={2}>
            题号
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              as="textarea"
              type="text"
              defaultValue={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="edit--sa--detail">
          <Form.Label column sm={2}>
            题干
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              as="textarea"
              defaultValue={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="edit--sa--scorerange">
          <Form.Label column sm={2}>
            最低分值
          </Form.Label>
          <Col sm={4}>
            <Form.Control
              defaultValue={minScore}
              onChange={(e) => setMinScore(e.target.value)}
            />
          </Col>
          <Form.Label column sm={2}>
            最高分值
          </Form.Label>
          <Col sm={4}>
            <Form.Control
              defaultValue={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
            />
          </Col>
        </Form.Group>


       <Form.Group as={Row} className="mb-3" controlId="edit--sa--scorerange">
        <Form.Label>计分方式</Form.Label>
            <Form.Select
              // value={question}
              defaultValue={scoringType}
              onChange={(e) => setscoringType(e.target.value)}
            >
              <option value={'E, '}>专家打分</option>
              <option value={"A,fill_full"}>自动打分（填写及满分）</option>

            
            </Form.Select>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="edit--sa--save-abort">
          <Col sm={12}>
            <Button
              variant="outline-success"
              onClick={() => props.handleQuestionUpdate(packQuestionData())}
            >
              保存
            </Button>

            <Button
              variant="outline-success"
              onClick={() => dispatch(deleteDraftItemQE({ id: props.qid }))}
            >
              删除
          </Button>

          </Col>
        </Form.Group>
      </Form>
    );
  };

  return (
    <div className="question-edit-card-container">
      <Card>
        <Card.Header className="card-question-contents-header">
          预览
          <Button
            variant="outline-dark"
            onClick={() => setDisplayVisible(!displayVisible)}
            aria-controls={`${qid}--display-collapse`}
            aria-expanded={displayVisible}
          >
            {displayVisible ? "隐藏" : "展开"}
          </Button>
        </Card.Header>
        <Collapse in={displayVisible}>
          <Card.Body id={`${qid}--display-collapse`}>
            <QuestionShortAnswerDisplay
              {...{
                qid,
                title,
                detail,
                readOnly: true,
              }}
            />
          </Card.Body>
        </Collapse>
        <Card.Header className="card-border-top card-question-contents-header ">
          编辑
          <Button
            variant="outline-dark"
            onClick={() => setEditorVisible(!editorVisible)}
            aria-controls={`${qid}--editor-collapse`}
            aria-expanded={editorVisible}
          >
            {editorVisible ? "隐藏" : "展开"}
          </Button>

          <Button
              variant="outline-primary"
              onClick={() => dispatch(swapDraftItemIndicesQE({ id: props.qid }))}
            >
              上移
            </Button>

            <Button
              variant="outline-primary"
              onClick={() => dispatch(updateDraftItemQE({ id: props.qid }))}
            >
              下移
            </Button>

          <Button
              variant="outline-success"
              onClick={() => dispatch(deleteDraftItemQE({ id: props.qid }))}
            >
              删除
          </Button>


        </Card.Header>
        <Collapse in={editorVisible}>
          <Card.Body id={`${qid}--editor-collapse`}>{renderEditor()}</Card.Body>
        </Collapse>
      </Card>
    </div>
  );
}
