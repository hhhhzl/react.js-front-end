import "../../style/qnaire.css";
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Spinner, Button , Form, Accordion, Modal} from "react-bootstrap";
import {
  deleteIndicatorIE,
  selectAllQuestionsIE,
  selectAllIndicatorsIE,
  updateIndicatorIE,
  updateQuestionQE,
  createIndicatorIE,
  fetchAllIndicatorsIE,
  fetchAllQuestionsQE,
  createDraftItemQE,
  commitDraftsQE,
  selectDraftsQE,
  selectIsLoadingQE,
  doublecommitDraftsQE,
} from "../../state/slices/question-edit";
import { mapQuestionType } from "../../constants/maps";
import QuestionEditCard from "../Question/questionEditCard";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import QuestionDisplayCard from "../Question/questionDisplayCard";



/////////////////////////////////////////////////////////////////


export default function QnaireQuestionEdit() {
  const { qnaire } = useParams();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllQuestionsQE({ qnaire }));
  }, [dispatch, qnaire]);

  const drafts = useSelector(selectDraftsQE);
  const parsedDrafts = useMemo(
    () =>
      drafts.map((q) => {
        const pq = {
          id: q.id,
          isRequired: q.is_required,
          maxScore: parseFloat(q.max_score),
          minScore: parseFloat(q.min_score),
          questionType: parseInt(q.question_type),
          rubric: q.rubric,
          rubric_detail: q.rubric_detail,
          title: q.title,
        };
        try {
          return {
            ...pq,
            ...JSON.parse(q.stem),
          };
        } catch (err) {
          console.error(err);
          return pq;
        }
      }),
    [drafts]
  );

  const handleQuestionAdd = (qtype) => {
    dispatch(
      createDraftItemQE({
        data: {
          id: `TEMP-${uuidv4()}`,
          question_type: qtype,
          title: "",
          stem: "{}",
          is_required: true,
          min_score: 0,
          max_score: 10,
          rubric: "E",
          rubric_detail: null,
          qnaire: qnaire,
        },
      })
    );
  };
  // onFocus={(e) =>dispatch(commitDraftsQE(),alert("已保存"), console.log("yibaocun"))}
  const [show, setShow]=useState(false);
  const isLoading = useSelector(selectIsLoadingQE);
  // setInterval(() => {
  //   commitDraftsQE()
  //   alert()
  // }, 3000);
  return (
    <div className="qnaire-q-main-container">
      {isLoading ? (
        <div className="loading-spinner-container">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <div className="qnaire-q-question-display" >
            {parsedDrafts.map((data, idx) => (
              <div key={data.id} id={`qnaire-question-edit-${idx + 1}`}>
                <QuestionEditCard questionOrder={idx} qid={data.id} {...data} />

              </div>
            ))}
          </div>
          <div className="qnaire-q-question-navbar">
            <div className="qnaire-q-question-saveall-container">
  
              <Button
                type="button"
                variant="outline-success"
                onClick={() => dispatch(commitDraftsQE(),setInterval(alert("保存成功，请勿重复保存！！！"),3000))
                // ,setInterval(alert("已保存,请勿重复保存"),3000)
                         }

              >
                保存编辑
                
              </Button>
            </div>

            <h5>添加问题</h5>
            <div className="qnaire-q-question-add-container">
              {Object.entries(mapQuestionType).map(([qtid, qtname]) => (
                <Button
                  key={qtid}
                  variant="outline-dark"
                  onClick={() => handleQuestionAdd(qtid)}
                >
                  {qtname}题
                </Button>
              ))}
            </div>
            <h5>问题列表</h5>
            <ul type ='circle'>
              {parsedDrafts.map((data, idx) => (
                <li key={data.id}>
                  <a href={`#qnaire-question-edit-${idx + 1}`}>
                    {data.title}
                    【{mapQuestionType[data.questionType]}题】
                  </a>
                </li>
              ))}
              </ul>
      
          </div>
        </>
      )}
    </div>
  );
}
