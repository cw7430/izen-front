import { Container, Row, Col } from 'react-bootstrap';

import { getProfile } from '@/features/hr/server/models/profiles';
import { ApiError } from '@/common/api/shared/error';
import {
  InternalServerError,
  KeyError,
  Unauthorized,
  ValidationError,
} from '@/common/components/layout/errors';
import { ResponseCode } from '@/common/api/shared/constants';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EmployeeProfileDetail({ params }: Props) {
  const { id } = await params;

  const REDIECT_TO = `/hr/profiles`;

  try {
    const profile = await getProfile(id);

    const {
      employeeCode,
      employeeName,
      positionName,
      departmentName,
      teamName,
      phone,
    } = profile;

    return (
      <>
        <div className="d-flex flex-column min-vh-100">
          <Container className="my-5">
            <Row>
              <Col>
                <h1 className="text-center mb-4">사원 정보</h1>
              </Col>
            </Row>
            <Row className="justify-content-center mb-3">
              <Col xs={12} md={8} lg={6}>
                <div className="border p-3 rounded">
                  <p>
                    <strong>{'사번: '}</strong>
                    {employeeCode}
                  </p>
                  <p>
                    <strong>{'이름: '}</strong>
                    {employeeName}
                  </p>
                  <p>
                    <strong>{'직급: '}</strong>
                    {positionName}
                  </p>
                  <p>
                    <strong>{'부서: '}</strong>
                    {departmentName}
                  </p>
                  <p>
                    <strong>{'팀: '}</strong>
                    {teamName}
                  </p>
                  <p>
                    <strong>{'전화번호: '}</strong>
                    {phone}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  } catch (e) {
    if (e instanceof ApiError) {
      if (
        e.code === ResponseCode.UNAUTHORIZED.code ||
        e.code === ResponseCode.EXPIRED_TOKEN.code ||
        e.code === ResponseCode.INVALID_TOKEN.code
      ) {
        return <Unauthorized />;
      }

      if (e.code === ResponseCode.KEY_ERROR.code) {
        return <KeyError />;
      }

      if (e.code === ResponseCode.RESOURCE_NOT_FOUND.code) {
        return <ValidationError redirectTo={REDIECT_TO} />;
      }
    }
    return <InternalServerError />;
  }
}
