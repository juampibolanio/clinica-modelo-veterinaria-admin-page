import { Container } from "@mui/material";
import { pageContainerStyles } from "./styles/pageContainer.styles";

/**
 * This component serves as a container for page content, providing consistent styling and layout.
 * @param {JSX.Element} children - The content to be displayed within the container.
 * @param {string} maxWidth - The maximum width of the container (default is 'xl').
 * @param {object} sx - Additional styling to be applied to the container.
 */
const PageContainer = ({ children, maxWidth = "xl", sx }) => {
    return (
        <Container maxWidth={maxWidth} sx={{ ...pageContainerStyles.container, ...sx }}>
            {children}
        </Container>
    );
};

export default PageContainer;