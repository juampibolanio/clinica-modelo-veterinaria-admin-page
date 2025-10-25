import { Container } from '@mui/material';
import { v } from '../../theme/variants';

const PageContainer = ({ children, maxWidth = 'xl', sx }) => {
    return (
        <Container maxWidth={maxWidth} sx={{ ...v.page, ...sx }}>
            {children}
        </Container>
    );
};

export default PageContainer;
