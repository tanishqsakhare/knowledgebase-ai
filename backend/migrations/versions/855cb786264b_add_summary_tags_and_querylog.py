"""Add summary, tags, and QueryLog

Revision ID: 855cb786264b
Revises: 
Create Date: 2025-07-11 22:31:19.330020

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '855cb786264b'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('query_log',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('query', sa.String(length=200), nullable=True),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('query_log')
    # ### end Alembic commands ###
